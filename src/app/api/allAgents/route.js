import { NextResponse } from "next/server"
import  AgentModel  from "@/lib/mongo/agents"
import connect from "@/lib/mongo";

export const GET = async (req, res) => {
    try {
        await connect()
        const agents = await AgentModel.find()
        
        return Response.json({ agents })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}