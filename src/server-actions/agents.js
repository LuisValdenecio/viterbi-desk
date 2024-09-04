'use server'

import prisma from '@/lib/prisma'
import { z } from "zod"
import { auth } from '@/auth'

const AgentFormSchema = z.object({
    agentName : z.string().min(1,{
      message : 'Please enter a valid name for the Agent.'
    }),
    channel : z.string().min(1,{
      message : 'Add a valid channel id'
    }),
    description : z.string().min(1,{
      message : 'Please select a valid description.',
    }).optional(),
})

const UpdateAgentFormSchema = z.object({
    agentName : z.string().min(1,{
      message : 'Please enter a valid name for the Agent.'
    }),
    agentId : z.string().min(1,{
      message : 'Add a valid channel id'
    }),
    action : z.string().min(1,{
      message : 'Please select a valid action.'
    }),
})

const DeleteAgentSchema = z.object({
  agentName : z.string().min(1,{
    message : 'Please type the name to remove the agent.'
  }),
  agentId : z.string().min(1,{
    message : 'Add a valid channel id'
  }),
})


const AgentCreationSession = AgentFormSchema.omit({})
const AgentDeletionSession = DeleteAgentSchema.omit({})
const UpdateAgentSession = UpdateAgentFormSchema.omit({})

export async function getMyAgents() {
  const session = await auth()

  try {

    const channels = await prisma.channel.findMany({
      where : {
        owner_id : session?.user?.id
      }
    })

    const channels_id = channels.map(channel => channel.channel_id)

    const agents = await prisma.agent.findMany({
      where : {
        channel_id : {
          in : channels_id
        }
      }
    })

    return agents

  } catch (error) {
    console.log(error)
  }
}



export async function getAllAgents() {

  const session = await auth()
  
  try {

    const teams = await prisma.team.findMany({
      where : {
        user_id : session?.user?.id
      }
    })

    console.log("TEAMS: ", teams)

    const teams_id = teams.map(team => team.team_id)

    console.log("TEAMS IDS: ", teams_id)

    const channels_teams = await prisma.team_channel.findMany({
      where : {
        teamId : {
          in : teams_id
        }
      }
    })

    console.log("CHANNELS: ", channels_teams)

    const channels = channels_teams.map(channel => channel.channelId)

    console.log("CHANNELS IDS: ", channels)

    const agents = await prisma.agent.findMany({
      where : {
        channel_id : {
          in : channels
        }
      }
    })

    console.log("AGENTS: ", agents)

    return agents
  } catch(error) {
    console.log(error)
  }
}
/*
export async function getAgentsByChannel(channelId) {
  try {
    const data = JSON.parse(
      JSON.stringify(
        await AgentModel
        .find({channelId : channelId})
        )
    )
    console.log("DATA FETCHED: ", data)
    return data
  } catch(error) {
    console.log(error)
  }
}

export async function deleteAgent(_prevstate, formData) {

    const validateFields = AgentDeletionSession.safeParse({
        agentName : formData.get('agentName'),
        agentId : formData.get('agentId')
    })

    if (!validateFields.success) {
        return {
          errors: validateFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }

    const { agentName, agentId } = validateFields.data

    try {

      const realName = await AgentModel.find({_id : agentId})
      console.log("AGENT: ", realName[0].agentName)

      if (realName[0].agentName !== agentName) {
        return {
          errors : [],
          message : 'The name does not match'
        }
      } else {
        // delete the agent here
        await AgentModel.deleteOne({_id : agentId})
      }

    } catch (err) {
      console.log(err)
    }
}
*/

export async function postAgent(_prevstate, formData) {
    const validateFields = AgentCreationSession.safeParse({
        agentName : formData.get('agentName'),
        channel : formData.get('channel'),
        description : formData.get('description')
    })

    console.log("VALIDATED FIELDS", validateFields)

    if (!validateFields.success) {
        return {
          errors: validateFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }

    const { agentName, channel, description } = validateFields.data

    try {
      const newAgent = await prisma.agent.create({
        data : {
          name : agentName,
          description : description,
          channel_id : channel
        }
      })

      return {
        message : 'Success',
        agentID : ""+newAgent.agent_id
      }

    } catch(error) {
        console.log(error)
        return {errMsg : error.message}
    }
}

/*
export async function updateAgent(_prevstate, formData) {
    console.log("FORM DATA : ", formData)
    const validateFields = UpdateAgentSession.safeParse({
        agentName : formData.get('agentName'),
        agentId : formData.get('agentId'),
        action : formData.get('action')
    })

    console.log("VALIDATED FIELDS", validateFields)

    if (!validateFields.success) {
        return {
          errors: validateFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }
    
    const { agentName, agentId, action } = validateFields.data

    try {
        const agent = await AgentModel.findOne({_id : agentId})
        agent.agentName = agentName
        agent.action = action
        agent.save()

        return {
          message : 'Success',
        }

    } catch(error) {
        console.log(error)
        return {errMsg : error.message}
    }
}
*/