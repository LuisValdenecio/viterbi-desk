import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";

export const GET = async (req, { params }) => {
    try {
        const agent = await prisma.agent.findFirst({
            where : {
                channel_id : params.id
            }
        })
                
        return Response.json({ agent })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}