import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { people } from "googleapis/build/src/apis/people";

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
                members: members_in_teams.filter(currentTeam => currentTeam.team_id === team.team_id).length,
                actual_members : members_in_teams.filter(currentTeam => currentTeam.team_id === team.team_id)
            }
        })

        const unique_members = members.filter((value, index) =>
            members.findIndex((team) => team.team_id == value.team_id) == index
        )

        const teams = myTeams.flatMap((team) => {
            return {
                team_id: team.team_id,
                name: team.team.name,
                task_quota : team.task_quota,
                used_task_quota : team.used_task_quota,
                members: unique_members.filter(currentTeam => currentTeam.team_id == team.team_id)[0].members,
                actual_members : unique_members.filter(currentTeam => currentTeam.team_id == team.team_id)[0].actual_members,
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