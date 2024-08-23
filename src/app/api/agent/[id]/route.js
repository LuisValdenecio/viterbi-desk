import { NextResponse } from "next/server"
import  AgentModel  from "@/lib/mongo/agents"
import connect from "@/lib/mongo";

export const GET = async (req, { params }) => {
    try {
        await connect()
        const agent = await AgentModel.findOne({_id : params.id})
        
        return Response.json({ agent })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}