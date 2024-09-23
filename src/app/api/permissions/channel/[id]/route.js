import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma";
import { auth } from '@/auth'

// this will be used to check authorization to delete tasks
export const GET = async (req, { params }) => {
    const session = await auth()

    try {
        // fetch all the teams associated with this channel
        const teams = await prisma.team_channel.findMany({
            where : {
                channel_id : params.id
            },
            select : {
                team_id : true
            }
        })

        const teams_ids = teams.flatMap(team => team.team_id)

        // find the teams I work associated with the channel
        const my_teams_admin = await prisma.user_privilege.findMany({
            where : {
                user_id : session?.user?.id,
                role : 'admin',
                team_id : {
                    in : teams_ids
                }
            }
        })

        const my_teams_owner = await prisma.user_privilege.findMany({
            where : {
                user_id : session?.user?.id,
                role : 'owner',
                team_id : {
                    in : teams_ids
                }
            }
        })

        const my_teams = my_teams_admin.concat(my_teams_owner)


        /* get the id of the channel this agent belongs to
        const privilege = await prisma.channel.findUnique({
            where : {
                owner_id : session?.user?.id,
                channel_id : params.id
            }   
        })
        */
        if (my_teams.length == 0) {
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