'use server'

import prisma from '@/lib/prisma'
import { z } from "zod"
import { auth } from '@/auth'
import bcrypt from "bcrypt"

const AgentFormSchema = z.object({
  agentName: z.string().min(1, {
    message: 'Please enter a valid name for the Agent.'
  }),
  channel: z.string().min(1, {
    message: 'Add a valid channel id'
  }),
  description: z.string().min(1, {
    message: 'Please select a valid description.',
  }).optional(),
})

const editAgentFormSchema = z.object({
  agentName: z.string().min(1, {
    message: 'Please enter a valid name for the Agent.'
  }),
  agentId: z.string().min(1, {
    message: 'Please enter a valid name for the Agent.'
  }),
  description: z.string().min(1, {
    message: 'Please select a valid description.'
  }),
})

const DeleteAgentFormSchema = z.object({
  password: z.string().min(1, {
    message: 'Please type in a valid password'
  }),
  agents_id: z.string().min(1, {
    message: 'Please type in a valid agent id'
  }),
})

const AgentCreationSession = AgentFormSchema.omit({})
const DeleteAgentSession = DeleteAgentFormSchema.omit({})
const UpdateAgentSession = editAgentFormSchema.omit({})

export async function getMyAgents() {
  const session = await auth()

  try {
    // make these set of queries a transaction later...

    const my_teams = await prisma.user_privilege.findMany({
      where: {
        user_id: session?.user?.id
      },
      select: {
        team_id: true
      }
    })

    const my_teams_ids = my_teams.flatMap(team => team.team_id)

    const my_channels = await prisma.team_channel.findMany({
      where: {
        team_id: {
          in: my_teams_ids
        }
      },
      select: {
        channel_id: true
      },
      distinct: ['channel_id']
    })

    const my_channels_id = my_channels.flatMap(channel => channel.channel_id)

    const my_agents = await prisma.agent.findMany({
      where: {
        channel_id: {
          in: my_channels_id
        }
      },
      include: {
        tasks: {
          select: {
            name: true,
            priority: true,
            status: true,
            task_id: true
          }
        }
      }
    })

    const channels_owned = await prisma.channel.findMany({
      where: {
        owner_id: session?.user?.id
      },
      select: {
        channel_id: true
      }
    })

    if (channels_owned) {

      const channels_owned_id = channels_owned.flatMap(channel => channel.channel_id)

      const agents_owned = await prisma.agent.findMany({
        where: {
          channel_id: {
            in: channels_owned_id
          }
        },
        include: {
          tasks: {
            select: {
              name: true,
              priority: true,
              status: true,
              task_id: true
            }
          }
        }
      })

      const results = my_agents.concat(agents_owned)
      const filtered = results.filter((value, index) =>
        results.findIndex((channel) => channel.agent_id == value.agent_id) == index
      )
      console.log("FILTERED DATA: ", filtered)
      return filtered
    }


    return my_agents

  } catch (error) {
    console.log(error)
  }
}

export async function deleteAgents(_prevstate, formData) {
  const session = await auth()

  const validatedFields = DeleteAgentSession.safeParse({
    password: formData.get('password'),
    agents_id: formData.get('agents_id')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields',
    };
  }

  const { password, agents_id } = validatedFields.data

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

        const privilege = await checkPrivilege(agents_id.split(",")[0])

        if (!privilege) {
          return {
            message: 'access denied'
          }
        }

        const array_of_agents_ids = agents_id.split(",")
        const deletedAgents = await prisma.agent.deleteMany({
          where: {
            agent_id: {
              in: array_of_agents_ids
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

export async function checkPrivilege(agentId) {
  const session = await auth()

  try {

    // 1st check to see if this user is suspended
    const agent_channel = await prisma.agent.findUnique({
      where : {
        agent_id : agentId
      },
      select : {
        channel_id : true
      }
    })

    const agent_channel_team = await prisma.channel.findUnique({
      where : {
        channel_id : agent_channel.channel_id
      },
      select : {
        team_id : true
      }
    })

    const account_status = await prisma.user_privilege.findMany({
      where : {
        status : 'active',
        team_id : agent_channel_team.team_id,
        user_id : session?.user?.id
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

    // check if this agent belongs to a channel you own
    const privilege = await prisma.agent.findUnique({
      where : {
        agent_id : agentId,
        channel_id : {
          in : my_channels_ids
        }
      }
    })

    return privilege

  } catch (error) {
    console.log(error)
  }
}

export async function getAgent(agentId) {
  try {
    const agent = await prisma.agent.findUnique({
      where: {
        agent_id: agentId
      },
      select: {
        name: true,
        description: true
      }
    })

    return agent

  } catch (error) {
    console.log(error)
  }
}

export async function postAgent(_prevstate, formData) {

  const session = await auth()

  const validateFields = AgentCreationSession.safeParse({
    agentName: formData.get('agentName'),
    channel: formData.get('channel'),
    description: formData.get('description')
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: 'Missing Fields',
    };
  }

  const { agentName, channel, description } = validateFields.data

  try {

    const privilege = await checkChannelPrivilege(channel)

    if (!privilege) {
      return {
        message: 'access denied'
      }
    }

    const newAgent = await prisma.agent.create({
      data: {
        name: agentName,
        description: description,
        channel_id: channel,
        user_id : session?.user?.id
      }
    })

    return {
      message: 'Success',
      agentID: "" + newAgent.agent_id
    }

  } catch (error) {
    console.log(error)
    return { errMsg: error.message }
  }
}

export async function editAgent(_prevstate, formData) {
  const validateFields = UpdateAgentSession.safeParse({
    agentName: formData.get('agentName'),
    agentId: formData.get('agentId'),
    description: formData.get('description')
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: 'Missing Fields',
    };
  }

  const { agentName, agentId, description } = validateFields.data

  try {

    const privilege = await checkPrivilege(agentId)
    if (!privilege) {
      return {
        message: 'access denied'
      }
    }

    const editedAgent = await prisma.agent.update({
      where: {
        agent_id: agentId
      },
      data: {
        name: agentName,
        description: description,
      }
    })

    return {
      message: 'Success',
      agentID: "" + editedAgent.agent_id
    }

  } catch (error) {
    console.log(error)
    return { errMsg: error.message }
  }
}

export async function checkChannelPrivilege(channelId) {
  const session = await auth()
  try {
    
    const agent_channel_team = await prisma.channel.findUnique({
      where : {
        channel_id : channelId
      },
      select : {
        team_id : true
      }
    })

    const account_status = await prisma.user_privilege.findMany({
      where : {
        status : 'active',
        team_id : agent_channel_team.team_id,
        user_id : session?.user?.id
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

    // get the channel that the agent belongs to:
    const privileges = my_channels_ids.filter((chnnl) => chnnl === channelId)

    if (privileges.length > 0) {
      return true
    } else {
      return false
    }

  } catch (error) {
    console.log(error)
  }
}

