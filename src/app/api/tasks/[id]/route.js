import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";

export const GET = async (req, { params }) => {
    try {
        const tasks = await prisma.task.findMany({
            where : {
                agent_id : params.id
            }
        })
        
        return Response.json({ tasks })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}