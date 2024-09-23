import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";
import { auth } from '@/auth'

export const GET = async (req, res) => {

    const session = await auth()

    try {

        const teams = await prisma.team.findMany({
            where : {
                user_id : session?.user?.id
            }
        })
        
        return Response.json({ teams })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}