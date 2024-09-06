import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma";
import { auth } from '@/auth'

export const GET = async (req, { params }) => {
    const session = await auth()
    const team = params.id

    try {
        
        const privilege = await prisma.user_privilege.findMany({
            where : {
                team_id : team,
                user_id : session?.user?.id
            }
        })

        return Response.json(privilege[0].user_role)

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}