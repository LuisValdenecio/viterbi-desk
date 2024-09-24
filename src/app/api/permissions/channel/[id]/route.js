import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma";
import { auth } from '@/auth'

// this will be used to check authorization to delete tasks
export const GET = async (req, { params }) => {
    const session = await auth()

    try {
         // all the queries here must be packed in a transaction
         const teams_iam_admin = await prisma.user_privilege.findMany({
            where: {
                user_id: session?.user?.id,
                role : 'admin'
            },
            include: {
                team: true,
            }
        })

        const teams_iam_owner = await prisma.user_privilege.findMany({
            where: {
                user_id: session?.user?.id,
                role : 'owner'
            },
            include: {
                team: true,
            }
        })

        const all_teams_ids = teams_iam_admin.concat(teams_iam_owner).flatMap(team => team.team_id)

        const my_channels = await prisma.channel.findMany({
            where : {
                team_id : {
                    in : all_teams_ids
                }
            }
        })

        if (my_channels.length == 0) {
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