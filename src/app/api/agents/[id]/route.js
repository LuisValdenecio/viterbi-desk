import { NextResponse } from "next/server"
import  AgentModel  from "@/lib/mongo/agents"
import connect from "@/lib/mongo";

export const GET = async (req, { params }) => {
    try {
        await connect()
        const agents = await AgentModel.find({channelId : params.id})
        
        return Response.json({ agents })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}