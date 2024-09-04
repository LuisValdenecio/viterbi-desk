import { NextResponse } from "next/server"

import prisma from "@/lib/prisma";

export const GET = async (req, { params }) => {
    try {

        const users_from_team = await prisma.user_privilege.findMany({
            where : {
                team_id : params.id
            }, 
            select : {
                user_id : true
            }
        })

        const users_id = users_from_team.map(user => user.user_id)
 
        const people = await prisma.user.findMany({
            where : {
                user_id: {
                    in : users_id
                }
            }
        })

        //const people = await prisma.user_privilege.findMany()
        return Response.json({ people })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}