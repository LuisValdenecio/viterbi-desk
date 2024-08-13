'use server'

import ChannelModel from "@/lib/mongo/channels"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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


export async function postChannel(formData) {
 
    const {name, provider} = formData
    console.log(name, provider)
    // validate here
    if (!name || !provider) {
      throw new Error('Missing name or email')
    }
  
    try {
      
      const newChannel = await ChannelModel.create({name, provider})
      newChannel.save()
  
      revalidatePath('/dashboard/channel')
      redirect('/dashboard/channel')
  
      return true
  
    } catch(error) {
      console.log(error)
      return {errMsg : error.message}
    }
  }