import { NextResponse } from "next/server"

import prisma from "@/lib/prisma";
import { auth } from '@/auth'

export const GET = async (req, res) => {

    const session = await auth()

    try {

        const my_teams = await prisma.user_privilege.findMany({
            where : {
                user_id : session?.user?.id
            },
            select : {
                team_id : true
            }
        })

        const my_teams_ids = my_teams.flatMap(team => team.team_id)

        const users_from_team = await prisma.user_privilege.findMany({
            where : {
                team_id : {
                    in : my_teams_ids
                }
            }, 
            include : {
                user : {
                    select : {
                        user_id : true,
                        name : true,
                        img : true,
                        email : true,
                    }
                },
                team : {
                    select : {
                        name : true,
                        team_id : true
                    }
                }
            }
        })

        const people = users_from_team.flatMap((member) => {
            return {
                name : member.user.name,
                task_quota : member.task_quota,
                used_task_quota : member.used_task_quota,
                playground_quota : member.daily_playground_quota,
                used_daily_playground_quota : member.used_daily_playground_quota,
                email : member.user.email,
                team : member.team.name,
                team_id : member.team.team_id,
                img : member.user.img,
                user_id : member.user.user_id,
                role : member.role,
                status : member.status
            }
        })

        return Response.json({ people })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}