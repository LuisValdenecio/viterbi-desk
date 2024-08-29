'use server'

import ChannelModel from "@/lib/mongo/channels"
import GoogleTokenModel from "@/lib/mongo/googleTokens";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod"

// for testing loading, suspense and skeletons
export async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


const ChannelFormSchema = z.object({
  channelName : z.string().min(1,{
    message : 'Please enter a valid name for the channel.'
  }),
  id : z.string().min(1,{
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

export async function getAllChannels() {
  try {
    const data = JSON.parse(
      JSON.stringify(
        await ChannelModel
        .find()
        )
    )

    return data
  } catch (error) {
    console.log(error)
  }
}

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


export async function postChannel(_prevstate, formData) {

    console.log(formData)

    
    const validateFields = ChannelCreationSession.safeParse({
      channelName : formData.get('channelName'),
      id : "CH-3450",
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
    
    const {channelName, id, token, provider, description} = validateFields.data
   
    try {

      const token_provider = token.split('-')[0]
      const token_id = token.split('-')[token.split('-').length - 1]

      switch(token_provider) {
        case 'Gmail' : 
          const find_google_token = await GoogleTokenModel.find({_id : token_id})
          if (!find_google_token) {
            return {
              message : 'Invalid token'
            }
          }

          const name = channelName
          const newChannel = await ChannelModel.create({name, id, description, provider})
          newChannel.googleToken = token_id
          newChannel.save()

          return {
            message : 'Success',
            channelId : newChannel._id
          }
              
        default :
          break
      }

      
  
    } catch(error) {
      console.log(error)
      return {errMsg : error.message}
    }
      
  }