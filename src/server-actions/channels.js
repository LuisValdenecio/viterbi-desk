'use server'

import { z } from "zod"
import prisma from "@/lib/prisma";
import { auth } from '@/auth'
import bcrypt from "bcrypt"

const DeleteChannelFormSchema = z.object({
  password: z.string().min(1, {
      message: 'Please type in a valid password'
  }),
  channels_ids: z.string().min(1, {
      message: 'Please type in a valid channel id'
  }),
})

const ChannelFormSchema = z.object({
  channelName : z.string().min(1,{
    message : 'Please enter a valid name for the channel.'
  }),
  token : z.string().min(1,{
    message : 'The authorization is missing for this provider'
  }),
  provider : z.string().min(1,{
    message : 'Please select a valid provider.'
  }),
  description : z.string().min(1, {
    message : 'Please type in a valid description'
  })
})

const ChannelCreationSession = ChannelFormSchema.omit({})
const DeleteChannelSession = DeleteChannelFormSchema.omit({})

export async function deleteTeam(_prevstate, formData) {
    
  const session = await auth()
  
  const validatedFields = DeleteChannelSession.safeParse({
    password : formData.get('password'),
    channels_ids : formData.get('channels_ids')
  })
  console.log("FORM DATA: ", formData)
  console.log(validatedFields.success)
  console.log(validatedFields )
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields',
    };
  }
  console.log("VALIDATION STATUS: ", validatedFields.success)
  
  const { password, channels_ids } = validatedFields.data
  
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
      console.log("step 3")
      
      if (passwordMatch) {
        
        console.log("step 4")
        
        const arrays_of_channels_ids = channels_ids.split(",")
        const deleletedChannels = await prisma.channel.deleteMany({
          where : {
            channel_id : {
              in : arrays_of_channels_ids
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


export async function getAllMyChannels() {
  const session = await auth()
  try {
    // all the queries here must be packed in a transaction
    const teams = await prisma.user_privilege.findMany({
      where : {
        user_id : session?.user?.id
      },
      include : {
        team : true
      }
    })

    const team_ids = teams.flatMap(team => team.team_id)

    const my_channels = await prisma.team_channel.findMany({
      where : {
        team_id : {
          in : team_ids
        }
      },
      select : {
        channel_id : true
      },
      distinct : ['channel_id']
    })

    const channel_ids = my_channels.flatMap(channel => channel.channel_id)
    
    
    const channels = await prisma.channel.findMany({
      where : {
        channel_id : {
          in : channel_ids
        }
      },
      include : {
        agents : true
      }
    })

    const channels_onwed = await prisma.channel.findMany({
      where : {
        owner_id : session?.user?.id
      },
      include : {
        agents : true
      }
    })

    const results =  channels.concat(channels_onwed)
    const filtered = results.filter((value, index) => 
      results.findIndex((channel) => channel.channel_id == value.channel_id) == index  
    ) 
    
    // avoids duplicates
    console.log("FILTERED CHANNELS: ", filtered)

    return filtered

  } catch (error) {
    console.log(error)
  }
}

export async function postChannel(_prevstate, formData) {

    const session = await auth()
    
    const validateFields = ChannelCreationSession.safeParse({
      channelName : formData.get('channelName'),
      token : formData.get('token'),
      provider : formData.get('provider'),
      description : formData.get('description')
    })

    if (!validateFields.success) {
      return {
        errors: validateFields.error.flatten().fieldErrors,
        message: 'Missing Fields',
      };
    }

    console.log("VALIDATED FIELDS: ", validateFields)
    
    const {channelName, token, provider, description} = validateFields.data
   
    try {

      const token_provider = token.split('-')[0]
      const token_id = token.split('-')[token.split('-').length - 1]

      switch(token_provider) {
        case 'Gmail' : 
          const google_token = await prisma.google_token.findFirst({
            where : {
              id : token_id
            }
          })

          if (!google_token) {
            return {
              message : 'Invalid token'
            }
          }

          const userOwner = await prisma.user.findFirst({
            where : {
              user_id : session?.user?.id
            }
          })

          if (!userOwner) {
            return {
              message : 'The user attempting to create this channel does not exist'
            }
          }

          const newChannel = await prisma.channel.create({
            data : {
              name : channelName,
              provider : provider,
              description : description,
              owner_id : session?.user?.id,
              google_token_id : token_id,
            }
          })

          return {
            message : 'Success',
            channelId : newChannel.channel_id
          }
        case 'Discord' :
          
          const newDiscordChannel = await prisma.channel.create({
            data : {
              name : channelName,
              provider : 'Discord',
              description : description,
              owner_id : session?.user?.id,
            }
          })

          return {
            message : 'Success',
            channelId : newDiscordChannel.channel_id
          }   
        default :
          break
      }

      
  
    } catch(error) {
      console.log(error)
      return {errMsg : error.message}
    }
      
  }