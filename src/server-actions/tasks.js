'use server'


import {executeGmailTask} from '../server-actions/provider-based-task'
import { executeDiscordTask } from '../server-actions/provider-based-task'

import { z } from 'zod'
import prisma from '@/lib/prisma'


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


export async function postTask(_prevstate, formData) {
    
    const validatedFields = TaskCreationSession.safeParse({
        taskName : formData.get('taskName'),
        priority : formData.get('priority'),
        agentId : formData.get('agentId'),
        status : 'functioning',
        timezone : formData.get('timezone'),
        day : formData.get('day'),
        id : 'TASK-1B',
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
        agentId,
        status,
        timezone,
        day,
        id,
        day_period,
        hour_minute,
    } = validatedFields.data

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

}