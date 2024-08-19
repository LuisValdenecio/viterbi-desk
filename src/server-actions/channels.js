'use server'

import ChannelModel from "@/lib/mongo/channels"
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
  provider : z.string().min(1,{
    message : 'Please select a valid provider.'
  }),
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

    const validateFields = ChannelCreationSession.safeParse({
      channelName : formData.get('channelName'),
      provider : formData.get('provider')
    })

    if (!validateFields.success) {
      return {
        errors: validateFields.error.flatten().fieldErrors,
        message: 'Missing Fields',
      };
    }
 
    const {channelName, provider} = validateFields.data
   
    try {
      console.log("data", {channelName, provider})
      const name = channelName
      const newChannel = await ChannelModel.create({name, provider})
      newChannel.save()
  
      return {
        message : 'Success',
        channelId : newChannel._id
      }
  
    } catch(error) {
      console.log(error)
      return {errMsg : error.message}
    }
  }