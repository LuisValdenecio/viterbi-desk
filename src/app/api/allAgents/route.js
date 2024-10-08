import { NextResponse } from "next/server"
import  prisma  from "@prisma/client";

export const GET = async (req, res) => {
    try {
        const agents = await prisma.agent.findMany()        
        return Response.json({ agents })
    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}