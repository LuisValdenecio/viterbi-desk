import { NextResponse } from "next/server"
import connectDB from "@/lib/mongo"
import { postManyContacts } from "@/server-actions/contacts"

export const POST = async (request) => {
    const contacts = await request.json()
    await connectDB()

    try {
        await postManyContacts(contacts.results.data)
    } catch(e) {
        return new NextResponse("couldnt updload", {
            status : 500
        })
    }
    return new NextResponse("data saved", {
        status : 201
    })
   
}

