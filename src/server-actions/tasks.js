'use server'


import {executeGmailTask} from '../server-actions/provider-based-task'
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
    taskName : z.string().min(1, {
        message : 'Please type in a valid name for the task'
    }),
    priority : z.string().min(1,{
        message : 'Please select a valid priority.'
    }),
    task_id: z.string().min(1, {
        message: 'Add a valid channel id'
    }),
    taskSchedule_id : z.string().min(1, {
        message: 'Add a valid schedule id'
    }),
    status : z.string().min(1,{
        message : 'Please select a valid status.',
    }).optional(),

    timezone : z.string().min(1, {
        message : 'Select a time zone'
    }),
    day : z.string().min(1, {
        message : 'Please select a valid time point'
    }),
    day_period : z.string().min(1, {
        message : 'Please select a valid time point'
    }),
    hour_minute : z.string().min(1, {
        message : 'Please select a valid time point'
    }),
  })
   
const TaskFormSchema = z.object({
    taskName : z.string().min(1, {
        message : 'Please type in a valid name for the task'
    }),
    priority : z.string().min(1,{
        message : 'Please select a valid priority.'
    }),
    agentId : z.string().min(1, {
        message : ''
    }),
    status : z.string().min(1,{
        message : 'Please select a valid status.',
    }).optional(),

    timezone : z.string().min(1, {
        message : 'Select a time zone'
    }),
    day : z.string().min(1, {
        message : 'Please select a valid time point'
    }),
    day_period : z.string().min(1, {
        message : 'Please select a valid time point'
    }),
    hour_minute : z.string().min(1, {
        message : 'Please select a valid time point'
    }),
})

const TaskCreationSession = TaskFormSchema.omit({})
const EditTaskSession = EditTaskFormSchema.omit({})
const DeleteTaskSession = DeleteTaskForSchema.omit({})

export async function deleteTaks(_prevstate, formData) {
    
    const session = await auth()

    const validatedFields = DeleteTaskSession.safeParse({
        password : formData.get('password'),
        tasks_ids : formData.get('tasks_ids')
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
            where : {
                user_id : session?.user?.id
            }
        })

        if (user) {
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            )

            if (passwordMatch) {

                const array_of_tasks_ids = tasks_ids.split(",")
                const deleletedPosts = await prisma.task.deleteMany({
                    where : {
                        task_id : {
                            in : array_of_tasks_ids
                        }
                    }
                })

                return {
                    message : 'Success'
                }
            } else {
                return {
                    message : 'incorrect password'
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export async function executeTask(formData) {

    const taskId = formData.get('task-id')

    try {
        // execute task code based on the provider
        const task = await prisma.task.findFirst({
            where : {
                task_id : taskId
            }
        })
        
        const agent = await prisma.agent.findFirst({
            where : {
                agent_id : task.agent_id
            }
        })

        const channel = await prisma.channel.findFirst({
            where : {
                channel_id : agent.channel_id
            }
        })
       
        switch(channel?.provider) {
            case 'Gmail' :
                await executeGmailTask(channel)
                break
            case 'Discord' : 
                await executeDiscordTask(formData)
                break  
            default :
            break
        }
        
    } catch(error) {
        console.log(error)
    }



    //
}


export async function getTask(task_id) {
    try {
        const task = await prisma.task.findUnique({
            where : {
                task_id : task_id
            },
            include : {
                task_schedule : true
            }
        })

        const resultData = {
            name : task.name,
            priority : task.priority,
            status : task.status,
            timezone : task.task_schedule.timezone,
            day : task.task_schedule.day,
            taskScheduleId : task.task_schedule.id,
            dayPeriod : task.task_schedule.dayPeriod,
            hourAndMinute : task.task_schedule.hourAndMinute
        }

        console.log("DATA FROM SERVER: ", resultData)
    
        return resultData

    } catch (error) {
        console.log(error)
    }
}

export async function postTask(_prevstate, formData) {

    console.log("FORMDATA: ", formData)
    
    const validatedFields = TaskCreationSession.safeParse({
        taskName : formData.get('taskName'),
        priority : formData.get('priority'),
        agentId : formData.get('agentId'),
        status : 'functioning',
        timezone : formData.get('timezone'),
        day : formData.get('day'),
        day_period : formData.get('day_period'),
        hour_minute : formData.get('hour_minute'),
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
        const taskSchedule = await prisma.task_Schedule.create({
            data : {
                timezone : timezone, 
                day : day, 
                dayPeriod : day_period, 
                hourAndMinute : hour_minute
            }
        })
    
        const newTask = await prisma.task.create({
            data : {
                name : taskName,
                priority : priority,
                status : status,
                agent_id : agentId,
                schedule : taskSchedule.id
            }
        })

        return {
            message : 'Success',
            taskName : newTask.name,
        }


    } catch (error) {
        console.log(error)
    }
}

export async function editTask(_prevstate, formData) {
    
    const validatedFields = EditTaskSession.safeParse({
        taskName : formData.get('taskName'),
        priority : formData.get('priority'),
        task_id : formData.get('task_id'),
        taskSchedule_id : formData.get('taskSchedule_id'),
        status : 'functioning',
        timezone : formData.get('timezone'),
        day : formData.get('day'),
        day_period : formData.get('day_period'),
        hour_minute : formData.get('hour_minute'),
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

    console.log("DATA FORM: ", validatedFields.data)
    
    try {   
        const taskSchedule = await prisma.task_Schedule.update({
            where : {
                id : taskSchedule_id
            },
            data : {
                timezone : timezone, 
                day : day, 
                dayPeriod : day_period, 
                hourAndMinute : hour_minute
            }
        })
    
        const editedTask = await prisma.task.update({
            where : {
                task_id : task_id
            },
            data : {
                name : taskName,
                priority : priority,
                status : status,
            }
        })

        return {
            message : 'Success',
            taskName : editedTask.name,
        }

    } catch (error) {
        console.log(error)
    }
   
}