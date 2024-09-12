import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma";
import { auth } from '@/auth'

// this will be used to check authorization to delete tasks
export const GET = async (req, { params }) => {
    const session = await auth()
   
    try {

        const isOwner = await prisma.user_privilege.findMany({
            where : {
                user_id : session?.user?.id,
                team_id : params.id,
            },
            select : {
                role : true
            }
        })
        
        if (isOwner[0].role === 'owner') {
            return Response.json("owner")
        } else {
            return Response.json("nonowner")
        }

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}