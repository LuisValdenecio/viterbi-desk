import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const GET = async (req, res) => {

    const session = await auth()
    try {
        
        const teams = await prisma.user_privilege.findMany({
            where : {
                user_id : session?.user?.id,
            },
            select : {
                team_id : true
            }
        })

        //const teams_ids = teams.flatMap(team => team[0].team_id)
        const teams_ids = teams.flatMap(team => team.team_id)

        // channels from the teams I am member of
        const channels = await prisma.team_channel.findMany({
            where : {
                team_id : {
                    in : teams_ids
                }
            },
            select: {
                channel_id : true
            }
        })

        // channels I own
        const channels_owned = await prisma.channel.findMany({
            where : {
                owner_id : session?.user?.id
            },
            select : {
                channel_id : true
            }
        })

        const channels_owned_ids = channels_owned.flatMap(channel => channel.channel_id)

        const channels_id = channels.flatMap(channel => channel.channel_id)
        
        const agents = await prisma.agent.findMany({
            where : {
                channel_id : {
                    in : channels_id.concat(channels_owned_ids)
                }
            },
            select : {
                agent_id : true
            }   
        })

        const agents_id = agents.flatMap(agent => agent.agent_id)

        const tasks = await prisma.task.findMany({
            where : {
                agent_id : {
                    in : agents_id
                }
            },
            include : {
                task_schedule : true,
                agent : {
                    select : {
                        name : true
                    }
                }
            }
        })
         
        console.log("TASKS RETURNED: ", tasks)
        return Response.json({ tasks })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}