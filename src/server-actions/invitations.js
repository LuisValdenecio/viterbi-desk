'use server'

import prisma from '@/lib/prisma'
import { z } from "zod"
import { auth } from '@/auth'
import { randomUUID } from 'crypto'

const InvitationFormSchema = z.object({
    email: z.string().email({
      message: 'Please enter a valid email address.'
    }),
    role: z.string().min(1, {
      message: 'Please select a valid role'
    }),
    teamId: z.string().min(1, {
        message: 'The given Id is not allowed'
    }),
})

const InvitationSession = InvitationFormSchema.omit({})

export async function sendInvitation(_prevstate, formData) {

    const session = await auth()

    const validatedFields = InvitationSession.safeParse({
        email : formData.get('email'),
        role : formData.get('role'),
        teamId : formData.get('teamId')
    })

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }

    const { email, role, teamId } = validatedFields.data
    
    try {   
        // make the queries below a transation, if one fails, all fail:
        const invitation_token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '')

        const member_invitation = await prisma.member_invitation.create({
            data : {
                guest_email : email, 
                guest_role : role,
                team_id : teamId,
            }
        })

        const invitation_info = await prisma.invitation_info.create({
            data : {
                invitation_info : member_invitation.id,
                inviter_id : session?.user?.id
            }
        })

        const invitation_link = await prisma.invitation_link.create({
            data : {
                token : invitation_token,
                link : `http://localhost:3000/api/team-invitation/${invitation_token}`,
                invitation_id : member_invitation.id
            }
        })

        return {
            message : 'Success'
        }

    } catch (error) {
        console.log(error)
    }

   
}