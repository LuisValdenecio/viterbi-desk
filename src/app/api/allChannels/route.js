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
                team: true
            }
        })

        const team_ids = teams.flatMap(team => team.team_id)

        const my_channels = await prisma.team_channel.findMany({
            where: {
                team_id: {
                    in: team_ids
                }
            },
            select: {
                channel_id: true
            },
            distinct: ['channel_id']
        })

        const channel_ids = my_channels.flatMap(channel => channel.channel_id)


        const channels = await prisma.channel.findMany({
            where: {
                channel_id: {
                    in: channel_ids
                }
            },
            include: {
                agents: true
            }
        })

        const channels_onwed = await prisma.channel.findMany({
            where: {
                owner_id: session?.user?.id
            },
            include: {
                agents: true
            }
        })

        const results = channels.concat(channels_onwed)
        const filtered = results.filter((value, index) =>
            results.findIndex((channel) => channel.channel_id == value.channel_id) == index
        )

        return Response.json({ filtered })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status: 500
        })
    }
}