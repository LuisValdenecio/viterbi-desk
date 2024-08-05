'use server'

import ContactModel from "@/lib/mongo/contacts";
import connectDB from "@/lib/mongo";

export async function getContacts(){
  try {
    await connectDB();
    const data = JSON.parse(JSON.stringify(await ContactModel.find()));

    // throw new Error('Error!')

    return { data }
  } catch (error) {
    return { errMsg: error.message }
  }
}