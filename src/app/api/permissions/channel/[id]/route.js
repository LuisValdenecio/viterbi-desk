import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma";
import { auth } from '@/auth'

// this will be used to check authorization to delete tasks
export const GET = async (req, { params }) => {
    const session = await auth()

    try {

        // get the id of the channel this agent belongs to
        const privilege = await prisma.channel.findUnique({
            where : {
                owner_id : session?.user?.id,
                channel_id : params.id
            }   
        })
    
        if (!privilege) {
            return Response.json("nonowner")
        } else {
            return Response.json("owner")
        }

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}