import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from '@/auth'

export const GET = async (req, { params }) => {
    try {

        const session = await auth()

        const url_token = params.token
        
        const token_exists = await prisma.invitation_link.findMany({
            where : {
                token : url_token
            }
        })

        if (!token_exists) {
            return Response.json("Token does not exists")
        }
        
        const invitation_info = await prisma.member_invitation.findMany({
            where : {
                guest_email : session?.user?.email
            },
            include : {
                invitation_link : true,
            }
        })

        console.log("INVITATION INFO: ", invitation_info)

        const foundTokenMatch = invitation_info.flatMap(invitation => invitation.invitation_link[0].token)
            .filter(token => token === url_token)

        if (foundTokenMatch.length === 0) {
            return Response.json("Token was not meant for this user")
        }

        // add the user to the team with the assigned privilege (it should a transaction):
        const user_privelege = await prisma.user_privilege.create({
            data : {
              role : invitation_info[0].guest_role,
              status : 'active',  // is it necessary??
              user_id : session?.user?.id,
              team_id : invitation_info[0].team_id
            }
        })

        const team_id = invitation_info[0].team_id

        const deleteFromInviteesList = await prisma.member_invitation.delete({
            where : {
                id : invitation_info[0].id
            }
        })
                
        const response = NextResponse.redirect(`http://localhost:3000/dashboard/teams/${team_id}`)
       
        return response     

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}