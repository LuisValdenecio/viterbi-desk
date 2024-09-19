import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma";
import { auth } from '@/auth'

// this will be used to check authorization to delete tasks
export const GET = async (req, { params }) => {
    const session = await auth()

    try {

         // give back all the teams I own
         const my_teams = await prisma.user_privilege.findMany({
            where : {
                role : 'owner',
                user_id : session?.user?.id
            }, 
            select : {
                team_id : true
            }
        })

        const my_teams_ids = my_teams.flatMap(team => team.team_id)

        // fetch all channels related to the teams I own
        const my_channels = await prisma.team_channel.findMany({
            where : {
                team_id : {
                    in : my_teams_ids
                }
            },
            select : {
                channel_id : true
            }
        })

        const my_channels_ids = my_channels.flatMap(channel => channel.channel_id)

        // get the id of the channel this agent belongs to
        const channl = await prisma.agent.findUnique({
            where : {
                agent_id : params.id
            },
            select : {
                channel_id : true
            }
        })

        const privilege = my_channels_ids.filter(channel => channel === channl.channel_id)
        
        if (privilege.length > 0) {
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