import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";
import { auth } from '@/auth'

export const GET = async (req, res) => {

    const session = await auth()

    try {

        const allTeams = await prisma.user_privilege.findMany({
            where : {
                user_id : session?.user?.id
            },
            select : {
                role : true
            }
        })

        const roles = allTeams.flatMap(team => team.role)

        const teams = {
            teams_owned : roles.filter(role => role === 'owner').length,
            other_teams : roles.filter(role => role !== 'owner').length
        }

        console.log("ROLES: ", roles)
        console.log("ALL TEAMS : ",  teams)

        return Response.json({ teams })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}