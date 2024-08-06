'use server'

import ContactModel from "@/lib/mongo/contacts";
import connectDB from "@/lib/mongo";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function getContacts(){
  try {
    await connectDB()
    const data = JSON.parse(JSON.stringify(await ContactModel.find()))

    // throw new Error('Error!')

    return { data }
  } catch (error) {
    return { errMsg: error.message }
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
    revalidatePath('/contacts')
  } catch(error) {
    console.log(error)
    return {errMsg : 'error updating contact'}
  }
}

export async function deleteContact(contactId) {
  try {
    await ContactModel.deleteOne({_id : contactId})
    revalidatePath('/contacts')
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

    revalidatePath('/contacts')
    redirect('/')

    return true

  } catch(error) {
    console.log(error)
    return {errMsg : error.message}
  }
}