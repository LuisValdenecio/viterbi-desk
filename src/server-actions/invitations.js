'use server'

import prisma from '@/lib/prisma'
import { z } from "zod"
import { auth } from '@/auth'

const InvitationFormSchema = z.object({
    email: z.string().email({
      message: 'Please enter a valid email address.'
    }),
    teamId: z.string().min(1, {
        message: 'The given Id is not allowed'
    }),
})

const InvitationSession = InvitationFormSchema.omit({})

export async function sendInvitation(_prevstate, formData) {

    const session = await auth()

    console.log("FORM DATA: ", formData)

    const validatedFields = InvitationSession.safeParse({
        email : formData.get('email'),
        teamId : formData.get('teamId')
    })

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }

    const { email, teamId } = validatedFields.data
    
    try {   

        const member_invitation = await prisma.member_invitation.create({
            data : {
                guest_email : email, 
                team_id : teamId,
            }
        })

        const invitation_info = await prisma.invitation_info.create({
            data : {
                invitation_info : member_invitation.id,
                inviter_id : session?.user?.id
            }
        })

        return {
            message : 'Success'
        }

    } catch (error) {
        console.log(error)
    }

   
}