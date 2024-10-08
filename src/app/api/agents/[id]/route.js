import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";

export const GET = async (req, { params }) => {
    try {
        const agents = await prisma.agent.findMany({
            where : {
                channel_id : params.id
            },
            include : {
                tasks : {
                  select : {
                    name : true,
                    priority : true,
                    status : true,
                    task_id : true
                  }
                }
              }
        })
        
        return Response.json({ agents })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}