'use server'

import { z } from "zod"
import prisma from "@/lib/prisma";
import { auth } from '@/auth'


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
/*
export async function getContactsSearch(perPage, page, searchQuery){
  try {
           
    let regex = new RegExp(searchQuery)
    const rawData = await ChannelModel
    .find({name: regex})
  

    const data = JSON.parse(
      JSON.stringify(
        await ChannelModel
        .find({name: regex})
        .skip(perPage * (page - 1))
        .limit(perPage)
        )
    )

    const items_count = rawData.length
  
    return { data, items_count  }
  } catch (error) {
   console.log(error)
  }
}
*/


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
    })

    const channels_onwed = await prisma.channel.findMany({
      where : {
        owner_id : session?.user?.id
      }
    })

    const results =  channels.concat(channels_onwed)
    const filtered = results.filter((value, index) => 
      results.findIndex((channel) => channel.channel_id == value.channel_id) == index  
    ) 
    
    // avoids duplicates
    return filtered

  } catch (error) {
    console.log(error)
  }
}
/*
export async function getChannles(){
  try {
     
    const data = JSON.parse(
      JSON.stringify(
        await ChannelModel
        .find()
        .limit(4)
        )
    )

    return data
  } catch (error) {
   console.log(error)
  }
}

export async function getChannel(channelId) {
  try {
    const data = JSON.parse(
      JSON.stringify(await ChannelModel.findOne({_id : channelId})))
      console.log("data ", data)
    return data
  } catch(err) {
    console.log(err)
  }
}
*/

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

          console.log("GOOGLE TOKEN", google_token)

          if (!google_token) {
            return {
              message : 'Invalid token'
            }
          }

          console.log("CREATE CHANNEL")

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


          //const newChannel = await ChannelModel.create({name, id, description, provider})
          //newChannel.googleToken = token_id
          //newChannel.save()

          return {
            message : 'Success',
            channelId : newChannel.channel_id
          }
              
        default :
          break
      }

      
  
    } catch(error) {
      console.log(error)
      return {errMsg : error.message}
    }
      
  }