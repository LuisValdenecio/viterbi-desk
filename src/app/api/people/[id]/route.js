import { NextResponse } from "next/server"

import prisma from "@/lib/prisma";

export const GET = async (req, { params }) => {
    try {

        const users_from_team = await prisma.user_privilege.findMany({
            where : {
                team_id : params.id
            }, 
            include : {
                user : {
                    select : {
                        user_id : true,
                        name : true,
                        img : true,
                        email : true,
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
                task_quota : member.task_quota,
                playground_quota : member.daily_playground_quota,
                email : member.user.email,
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