'use server'


import { executeGmailTask } from '../server-actions/provider-based-task'
import { executeDiscordTask } from '../server-actions/provider-based-task'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import bcrypt from "bcrypt"

const DeleteTaskForSchema = z.object({
    password: z.string().min(1, {
        message: 'Please type in a valid password'
    }),
    tasks_ids: z.string().min(1, {
        message: 'Please type in a valid agent id'
    }),
})

const EditTaskFormSchema = z.object({
    taskName: z.string().min(1, {
        message: 'Please type in a valid name for the task'
    }),
    priority: z.string().min(1, {
        message: 'Please select a valid priority.'
    }),
    task_id: z.string().min(1, {
        message: 'Add a valid channel id'
    }),
    taskSchedule_id: z.string().min(1, {
        message: 'Add a valid schedule id'
    }),
    status: z.string().min(1, {
        message: 'Please select a valid status.',
    }).optional(),

    timezone: z.string().min(1, {
        message: 'Select a time zone'
    }),
    day: z.string().min(1, {
        message: 'Please select a valid time point'
    }),
    day_period: z.string().min(1, {
        message: 'Please select a valid time point'
    }),
    hour_minute: z.string().min(1, {
        message: 'Please select a valid time point'
    }),
})

const TaskFormSchema = z.object({
    taskName: z.string().min(1, {
        message: 'Please type in a valid name for the task'
    }),
    priority: z.string().min(1, {
        message: 'Please select a valid priority.'
    }),
    agentId: z.string().min(1, {
        message: ''
    }),
    status: z.string().min(1, {
        message: 'Please select a valid status.',
    }).optional(),

    timezone: z.string().min(1, {
        message: 'Select a time zone'
    }),
    day: z.string().min(1, {
        message: 'Please select a valid time point'
    }),
    day_period: z.string().min(1, {
        message: 'Please select a valid time point'
    }),
    hour_minute: z.string().min(1, {
        message: 'Please select a valid time point'
    }),
})

const TaskCreationSession = TaskFormSchema.omit({})
const EditTaskSession = EditTaskFormSchema.omit({})
const DeleteTaskSession = DeleteTaskForSchema.omit({})

export async function deleteTaks(_prevstate, formData) {

    const session = await auth()

    const validatedFields = DeleteTaskSession.safeParse({
        password: formData.get('password'),
        tasks_ids: formData.get('tasks_ids')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields',
        };
    }

    const { password, tasks_ids } = validatedFields.data

    try {
        const user = await prisma.user.findUnique({
            where: {
                user_id: session?.user?.id
            }
        })

        if (user) {

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            )

            if (passwordMatch) {

                // check and see if this user can delete this task:
                const array_of_tasks_ids = tasks_ids.split(",")
                const privilege = await checkPrivilege(tasks_ids.split(",")[0])

                if (!privilege) {
                    return {
                        message: 'access denied'
                    }
                }

                console.log("TASKS IDS: ", tasks_ids.split(","))

                const deleletedPosts = await prisma.task.deleteMany({
                    where: {
                        task_id: {
                            in: array_of_tasks_ids
                        }
                    }
                })

                return {
                    message: 'Success'
                }
            } else {
                return {
                    message: 'incorrect password'
                }
            }
        }
    } catch (error) {
        console.log(error)
    }

}

export async function checkPrivilege(taskId) {
    const session = await auth()

    try {

        const task_agent = await prisma.task.findUnique({
            where : {
                task_id : taskId
            }, 
            select : {
                agent_id : true
            }
        })

        // 1st check to see if this user is suspended
        const agent_channel = await prisma.agent.findUnique({
            where: {
                agent_id: task_agent.agent_id
            },
            select: {
                channel_id: true
            }
        })

        const agent_channel_team = await prisma.channel.findUnique({
            where: {
                channel_id: agent_channel.channel_id
            },
            select: {
                team_id: true
            }
        })

        const account_status = await prisma.user_privilege.findMany({
            where: {
                status: 'active',
                team_id: agent_channel_team.team_id,
                user_id: session?.user?.id
            }
        })

        if (account_status.length === 0) {
            return false
        }

        // give back all the teams I own
        const my_teams = await prisma.user_privilege.findMany({
            where: {
                role: 'owner',
                user_id: session?.user?.id
            },
            select: {
                team_id: true
            }
        })

        const my_teams_ids = my_teams.flatMap(team => team.team_id)

        // fetch all channels related to the teams I own
        const my_channels = await prisma.channel.findMany({
            where: {
                team_id: {
                    in: my_teams_ids
                }
            },
            select: {
                channel_id: true
            }
        })

        const my_channels_ids = my_channels.flatMap(channel => channel.channel_id)

        // fetch the agent that owns the task
        const agentId = await prisma.task.findUnique({
            where: {
                task_id: taskId
            },
            select: {
                agent_id: true
            }
        })

        // get the id of the channel this agent belongs to
        const channel = await prisma.agent.findUnique({
            where: {
                agent_id: agentId.agent_id
            },
            select: {
                channel_id: true
            }
        })

        // get the channel that the agent belongs to:
        const privileges = my_channels_ids.filter((chnnl) => chnnl === channel.channel_id)

        if (privileges.length > 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
    }
}

export async function executeTask(formData) {

    const taskId = formData.get('task-id')

    try {
        // execute task code based on the provider
        const task = await prisma.task.findUnique({
            where: {
                task_id: taskId
            }
        })

        const agent = await prisma.agent.findUnique({
            where: {
                agent_id: task.agent_id
            }
        })

        const channel = await prisma.channel.findUnique({
            where: {
                channel_id: agent.channel_id
            }
        })

        switch (channel?.provider) {
            case 'Gmail':
                await executeGmailTask(channel)
                break
            case 'Discord':
                await executeDiscordTask(agent)
                break
            default:
                break
        }

    } catch (error) {
        console.log(error)
    }

}

export async function getTask(task_id) {
    try {
        const task = await prisma.task.findUnique({
            where: {
                task_id: task_id
            },
            include: {
                task_schedule: true
            }
        })

        const resultData = {
            name: task.name,
            priority: task.priority,
            status: task.status,
            timezone: task.task_schedule.timezone,
            day: task.task_schedule.day,
            taskScheduleId: task.task_schedule.id,
            dayPeriod: task.task_schedule.dayPeriod,
            hourAndMinute: task.task_schedule.hourAndMinute
        }

        return resultData

    } catch (error) {
        console.log(error)
    }
}

export async function postTask(_prevstate, formData) {

    console.log("PREV STATE: ", _prevstate)
    const session = await auth()

    const validatedFields = TaskCreationSession.safeParse({
        taskName: formData.get('taskName'),
        priority: formData.get('priority'),
        agentId: formData.get('agentId'),
        status: 'functioning',
        timezone: formData.get('timezone'),
        day: formData.get('day'),
        day_period: formData.get('day_period'),
        hour_minute: formData.get('hour_minute'),
    })

    //return {message : 'Success'}

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields',
        };
    }

    const {
        taskName,
        priority,
        agentId,
        status,
        timezone,
        day,
        day_period,
        hour_minute,
    } = validatedFields.data

    try {

        const privilege = await checkAgentPrivilege(agentId)

        if (!privilege) {
            if (_prevstate?.message === 'access denied') {
                return {
                    message: 'access denied',
                    retryTime : new Date()
                }
            } else {
                return {
                    message: 'access denied'
                }
            }
        }

        const checkQuota = await checkTaskQuota(agentId)

        if (!checkQuota) {

            if (_prevstate?.message === 'quota limit reached') {
                return {
                    message: 'quota limit reached',
                    userId : session?.user?.id,
                    agentId : agentId,
                    retryTime : new Date()
                }
            } else {
                return {
                    message: 'quota limit reached',
                    userId : session?.user?.id,
                    agentId : agentId,
                }
            }

        }

        const taskSchedule = await prisma.task_Schedule.create({
            data: {
                timezone: timezone,
                day: day,
                dayPeriod: day_period,
                hourAndMinute: hour_minute
            }
        })

        const newTask = await prisma.task.create({
            data: {
                name: taskName,
                priority: priority,
                status: status,
                agent_id: agentId,
                schedule: taskSchedule.id,
                user_id: session?.user?.id
            }
        })

        if (_prevstate?.message === 'Success') {
            return {
                message: 'Success',
                taskId: newTask.task_id,
                taskName: newTask.name,
                retryTime : new Date()
            }
        } else {
            return {
                message: 'Success',
                taskId: newTask.task_id,
                taskName: newTask.name,
            }
        }



    } catch (error) {
        console.log(error)
    }
}

export async function editTask(_prevstate, formData) {

    console.log("FORM DATA: ", formData)

    const validatedFields = EditTaskSession.safeParse({
        taskName: formData.get('taskName'),
        priority: formData.get('priority'),
        task_id: formData.get('task_id'),
        taskSchedule_id: formData.get('taskSchedule_id'),
        status: 'functioning',
        timezone: formData.get('timezone'),
        day: formData.get('day'),
        day_period: formData.get('day_period'),
        hour_minute: formData.get('hour_minute'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields',
        };
    }

    const {
        taskName,
        priority,
        task_id,
        taskSchedule_id,
        status,
        timezone,
        day,
        day_period,
        hour_minute,
    } = validatedFields.data

    try {

        // check and see if this user can delete this task:
        const privilege = await checkPrivilege(task_id.split(",")[0])

        if (!privilege) {
            return {
                message: 'access denied'
            }
        }

        const taskSchedule = await prisma.task_Schedule.update({
            where: {
                id: taskSchedule_id
            },
            data: {
                timezone: timezone,
                day: day,
                dayPeriod: day_period,
                hourAndMinute: hour_minute
            }
        })

        const editedTask = await prisma.task.update({
            where: {
                task_id: task_id
            },
            data: {
                name: taskName,
                priority: priority,
                status: status,
            }
        })

        return {
            message: 'Success',
            taskName: editedTask.name,
        }

    } catch (error) {
        console.log(error)
    }

}

export async function checkTaskQuota(agentId) {
    const session = await auth()

    try {
         // 1st check to see if this user is suspended
         const agent_channel = await prisma.agent.findUnique({
            where: {
                agent_id: agentId
            },
            select: {
                channel_id: true
            }
        })

        const agent_channel_team = await prisma.channel.findUnique({
            where: {
                channel_id: agent_channel.channel_id
            },
            select: {
                team_id: true
            }
        })

        const membership_quota = await prisma.user_privilege.findMany({
            where: {
                status: 'active',
                team_id: agent_channel_team.team_id,
                user_id: session?.user?.id
            }, 
            select : {
                task_quota : true,
                used_task_quota : true,
                id : true
            }
        })

        if (membership_quota[0].task_quota === membership_quota[0].used_task_quota) {
            return false
        }

        // increase the count on used task quota
        const used = membership_quota[0].used_task_quota + 1

        const updated_quota = await prisma.user_privilege.update({
            where : {
                id : membership_quota[0].id
            },
            data : {
                used_task_quota : used
            }
        })

        return true

    } catch (error) {
        console.log(error)
    }
}

export async function checkAgentPrivilege(agentId) {
    const session = await auth()

    try {

        // 1st check to see if this user is suspended
        const agent_channel = await prisma.agent.findUnique({
            where: {
                agent_id: agentId
            },
            select: {
                channel_id: true
            }
        })

        const agent_channel_team = await prisma.channel.findUnique({
            where: {
                channel_id: agent_channel.channel_id
            },
            select: {
                team_id: true
            }
        })

        const account_status = await prisma.user_privilege.findMany({
            where: {
                status: 'active',
                team_id: agent_channel_team.team_id,
                user_id: session?.user?.id
            }
        })

        if (account_status.length === 0) {
            return false
        }

        // give back all the teams I own
        const teams_i_own = await prisma.user_privilege.findMany({
            where: {
                role: 'owner',
                user_id: session?.user?.id
            },
            select: {
                team_id: true
            }
        })

        const teams_im_admin = await prisma.user_privilege.findMany({
            where: {
                role: 'admin',
                user_id: session?.user?.id
            },
            select: {
                team_id: true
            }
        })

        const my_teams_ids = teams_i_own.concat(teams_im_admin).flatMap(team => team.team_id)

        // fetch all channels related to the teams I own
        const my_channels = await prisma.channel.findMany({
            where: {
                team_id: {
                    in: my_teams_ids
                }
            },
            select: {
                channel_id: true
            }
        })

        const my_channels_ids = my_channels.flatMap(channel => channel.channel_id)

        // check if this agent belongs to a channel you own
        const privilege = await prisma.agent.findUnique({
            where: {
                agent_id: agentId,
                channel_id: {
                    in: my_channels_ids
                }
            }
        })

        return privilege

    } catch (error) {
        console.log(error)
    }
}