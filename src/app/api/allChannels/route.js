import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";
import { auth } from '@/auth'


export const GET = async (req, res) => {
    const session = await auth()

    try {

        // all the queries here must be packed in a transaction
        const teams = await prisma.user_privilege.findMany({
            where: {
                user_id: session?.user?.id
            },
            include: {
                team: true,
            }
        })

        const team_ids = teams.flatMap(team => team.team_id)
        console.log("TEAM IDS: ", team_ids.filter(id => id === 'cm1fmrv9q00019shuy38q9hy6'))

        const my_channels = await prisma.channel.findMany({
            where: {
                team_id: {
                    in: team_ids
                }
            },
            include : {
                team : true,
            },
        })
        
        return Response.json({ filtered : my_channels })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status: 500
        })
    }
}