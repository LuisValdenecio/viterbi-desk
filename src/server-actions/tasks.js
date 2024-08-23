'use server'

import TaskModel from '@/lib/mongo/tasks'
import TaskScheduleModel from '@/lib/mongo/taskSchedule'
import TaskTemplateModel from '@/lib/mongo/taskTemplate'
import AgentModel from '@/lib/mongo/agents'
import { z } from 'zod'

const TaskFormSchema = z.object({
    taskName : z.string().min(1, {
        message : 'Please type in a valid name for the task'
    }),
    agentId : z.string().min(1, {
        message : ''
    }),
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
    template : z.string().min(1, {
        message : 'Select a template'
    }),
})

const TaskCreationSession = TaskFormSchema.omit({})


export async function postTask(_prevstate, formData) {
    
    const validatedFields = TaskCreationSession.safeParse({
        taskName : formData.get('taskName'),
        agentId : formData.get('agentId'),
        timezone : formData.get('timezone'),
        day : formData.get('day'),
        day_period : formData.get('day_period'),
        hour_minute : formData.get('hour_minute'),
        template : formData.get('template'),
    })

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }

    const { 
        taskName,
        agentId,
        timezone,
        day,
        day_period,
        hour_minute,
        template 
    } = validatedFields.data

    const template_description = 'some description'

    const taskSchedule = await TaskScheduleModel.create({
        timezone : timezone, 
        day : day, 
        dayPeriod : day_period, 
        hourAndMinute : hour_minute
    })
    taskSchedule.save()

    const taskTemplate = await TaskTemplateModel.create({
        templateName : template, 
        templateDescription : template_description
    })
    
    taskTemplate.save()

    const agent = await AgentModel.find({_id : agentId})
    
    const task = await TaskModel.create({
        taskName : taskName, 
        agent : agentId,
        schedule : taskSchedule._id, 
        template : taskTemplate._id
    })   
    task.save()
    
    console.log(task)

    //console.log(validatedFields.data)


}