'use server'

import TaskModel from '@/lib/mongo/tasks'
import TaskScheduleModel from '@/lib/mongo/taskSchedule'
import TaskTemplateModel from '@/lib/mongo/taskTemplate'
import AgentModel from '@/lib/mongo/agents'
import ChannelModel from '@/lib/mongo/channels'
import GoogleTokenModel from '@/lib/mongo/googleTokens'
import { google } from "googleapis"

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

export async function executeTask(formData) {
    console.log(formData)

    const agentId = formData.get('task-agent')

    const token = {}

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/api/auth/callback/google'
    );

    try {
        const agent = await AgentModel.find({_id : agentId})
        console.log(agent)
        const channel = await ChannelModel.find({_id : agent[0]?.channelId})
        console.log(channel)
        const googleToken = await GoogleTokenModel.find({_id : channel[0]?.token})

        token.access_token = googleToken[0]?.access_token
        token.refresh_token = googleToken[0]?.refresh_token
        token.scope = googleToken[0]?.scope

        oauth2Client.setCredentials(token);

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const messages = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
          });
      
          const messageDetailsPromises = messages.data.messages.map((message) =>
            gmail.users.messages.get({ userId: 'me', id: message.id })
          );
      
          const messageDetails = await Promise.all(messageDetailsPromises);
      
          console.log(messageDetails)
        

    } catch (error) {
        console.log(error)
        return {
            message : 'Could not run task, try again later'
        }
    }


}


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