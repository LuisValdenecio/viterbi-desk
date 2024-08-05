import { NextResponse } from "next/server";
import connect from "@/lib/mongo";
import Contact from "@/lib/mongo/contacts";




export async function GET(req) {
    await connect();
    const data = await Contact.find()
    return NextResponse.json({ "data": data })
}