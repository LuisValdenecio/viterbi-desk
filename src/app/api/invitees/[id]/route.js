import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";

export const GET = async (req, { params }) => {
    try {
        const invitees = await prisma.member_invitation.findMany({
            where : {
                team_id : params.id,
            },
            include : {
                invitation_info : {
                    include : {
                        user : {
                            select : {
                                user_id : true,
                                invitation_info : true,
                                name : true,
                                email : true
                            }
                        }
                    }
                },
            },
        })

        const invitees_data = invitees.flatMap((invitee) => {
            return {
                guest_email : invitee.guest_email,
                guest_role : invitee.guest_role,
                invitation_id : invitee.invitation_info.flatMap(ele => ele.invitation_info)[0],
                inviter_id : invitee.invitation_info.flatMap(ele => ele.inviter_id)[0],
                inviter_name : invitee.invitation_info.flatMap(ele=> ele.user.name)[0],
                inviter_email : invitee.invitation_info.flatMap(ele=> ele.user.email)[0]
            }
        })
        
        return Response.json({ invitees_data })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}