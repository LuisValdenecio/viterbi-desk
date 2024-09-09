import { NextResponse } from "next/server"

import prisma from "@/lib/prisma";

export const GET = async (req, { params }) => {
    try {

        const users_from_team = await prisma.user_privilege.findMany({
            where : {
                team_id : params.id
            }, 
            include : {
                user : {
                    select : {
                        user_id : true,
                        name : true,
                        img : true,
                        email : true,
                    }
                }
            }
        })

        const people = users_from_team.flatMap((member) => {
            return {
                name : member.user.name,
                email : member.user.email,
                role : member.role,
                status : member.status
            }
        })

        return Response.json({ people })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}