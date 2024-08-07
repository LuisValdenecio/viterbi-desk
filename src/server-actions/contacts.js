'use server'

import ContactModel from "@/lib/mongo/contacts";
import connectDB from "@/lib/mongo";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function getContacts(perPage, page, searchQuery){
  try {
    await connectDB()
        
    let regex = new RegExp(searchQuery)
    const rawData = await ContactModel
    .find({name: regex})
  

    const data = JSON.parse(
      JSON.stringify(
        await ContactModel
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


export async function updateContact(contactId, newName, newEmail) {
  try {
    console.log("id equals to",contactId)
    await connectDB()
    const contact = await ContactModel.findOne({_id : contactId})
    contact.name = newName
    contact.email = newEmail
    contact.save()
    revalidatePath('/dashboard/contacts')
  } catch(error) {
    console.log(error)
    return {errMsg : 'error updating contact'}
  }
}

export async function deleteContact(contactId) {
  try {
    await ContactModel.deleteOne({_id : contactId})
    revalidatePath('/dashboard/contacts')
    return ('todo deleted')
  } catch(error) {
    return {errMsg : 'error deleting contact'}
  }
}

export async function postContact(formData) {
 
  await connectDB()

  const {name, email} = formData
  console.log(email, name)
  // validate here
  if (!name || !email) {
    throw new Error('Missing name or email')
  }

  try {
    
    const newContact = await ContactModel.create({name, email})
    newContact.save()

    revalidatePath('/dashboard/contacts')
    redirect('/dashboard/contacts')

    return true

  } catch(error) {
    console.log(error)
    return {errMsg : error.message}
  }
}