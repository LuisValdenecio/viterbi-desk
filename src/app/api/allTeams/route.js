import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const GET = async (req, res) => {

    const session = await auth()
    try {

        const myTeams = await prisma.user_privilege.findMany({
            where: {
                user_id: session?.user?.id
            },
            include: {
                team: true
            }
        })

        const teams_ids = myTeams.flatMap(team => team.team_id)

        const members_in_teams = await prisma.user_privilege.findMany({
            where: {
                team_id: {
                    in: teams_ids
                }
            }
        })

        const members = await members_in_teams.flatMap((team) => {
            return {
                team_id: team.team_id,
                members: members_in_teams.filter(currentTeam => currentTeam.team_id === team.team_id).length
            }
        })

        const unique_members = members.filter((value, index) =>
            members.findIndex((team) => team.team_id == value.team_id) == index
        )

        const teams = myTeams.flatMap((team) => {
            return {
                team_id: team.team_id,
                name: team.team.name,
                members: unique_members.filter(currentTeam => currentTeam.team_id == team.team_id)[0].members,
                description: team.team.description,
                user_id: team.id,
                user_role: team.role
            }
        })

        return Response.json({ teams })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status: 500
        })
    }
}