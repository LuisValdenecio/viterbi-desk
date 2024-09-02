import { NextResponse } from "next/server"
import  prisma  from "@prisma/client";

export const GET = async (req, res) => {
    try {
        await connect()
        const channels = await prisma.channel.findMany()
        return Response.json({ channels })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}