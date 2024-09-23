import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma";
import { auth } from '@/auth'

// this will be used to check authorization to delete tasks
export const GET = async (req, { params }) => {
    const session = await auth()

    try {

         // give back all the teams I own
         const my_teams_owner = await prisma.user_privilege.findMany({
            where : {
                role : 'owner',
                user_id : session?.user?.id
            }, 
            select : {
                team_id : true
            }
        })

        const my_teams_admin = await prisma.user_privilege.findMany({
            where : {
                role : 'admin',
                user_id : session?.user?.id
            }, 
            select : {
                team_id : true
            }
        })

        const my_teams_ids = my_teams_owner.concat(my_teams_admin).flatMap(team => team.team_id)

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
        
        // Check if the current user is the owner of the channel
        //const isChannelOwner = channelDetails.owner_id === session?.user?.id;
        
        //const channelId = agentChannel.channel_id;
        
        // Fetch the channel the agent belongs to
        const agentChannel = await prisma.agent.findUnique({
            where: {
                agent_id: params.id
            },
            select: {
                channel_id: true
            }
        });

        // Fetch the channel details including the owner_id
        const channelOwnership = await prisma.channel.findUnique({
            where: {
                channel_id: agentChannel.channel_id,
                owner_id : session?.user?.id
            }
        });

        if (channelOwnership) {
            return Response.json("owner")
        } 

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