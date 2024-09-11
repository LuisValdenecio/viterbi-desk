'use server'

import prisma from '@/lib/prisma'
import { z } from "zod"
import { auth } from '@/auth'
import { randomUUID } from 'crypto'
import bcrypt from "bcrypt"

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

const EditInvitationFormSchema = z.object({
    email: z.string().email({
      message: 'Please enter a valid email address.'
    }),
    invitation_id: z.string().min(1, {
        message: 'Please type in a valid id'
    }),
    role: z.string().min(1, {
      message: 'Please select a valid role'
    }),
})
  
const DeleteInvitationFormSchema = z.object({
    password: z.string().min(1, {
        message: 'Please type in a valid password'
    }),
    invitations_id: z.string().min(1, {
        message: 'Please type in a valid id'
    }),
  })

const InvitationSession = InvitationFormSchema.omit({})
const EditInvitationSession = EditInvitationFormSchema.omit({})
const DeleteInvitationSession = DeleteInvitationFormSchema.omit({})

export async function getInvitation(invitation_id) {
    try {
        const invitation = await prisma.member_invitation.findUnique({
            where : {
                id : invitation_id
            },
            select : {
                guest_email : true,
                guest_role : true
            }
        })

        return invitation
    } catch (error) {
        console.log(error)
    }
}

export async function deleteInvitations(_prevstate, formData) {

    const session = await auth()

    const validatedFields = DeleteInvitationSession.safeParse({
        password: formData.get('password'),
        invitations_id: formData.get('invitations_id'),
    })

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }
  
    const { password, invitations_id } = validatedFields.data

    try {
        const user = await prisma.user.findUnique({
            where : {
                user_id : session?.user?.id
            }
        })
  
        if (user) {
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            )
  
            if (passwordMatch) {
  
                const array_of_invitations_ids = invitations_id.split(",")
                const deletedInvitations = await prisma.member_invitation.deleteMany({
                    where : {
                        id : {
                            in : array_of_invitations_ids
                        }
                    }
                })
  
                return {
                    message : 'Success'
                }
            } else {
                return {
                    message : 'incorrect password'
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

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

export async function editInvitation(_prevstate, formData) {

    console.log("FORM DATA : ", formData)

    const validatedFields = EditInvitationSession.safeParse({
        email : formData.get('email'),
        invitation_id : formData.get('invitation_id'),
        role : formData.get('role')
    })

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }

    const { email, invitation_id, role } = validatedFields.data
    
    try {   
        
        const editedInvitation = await prisma.member_invitation.update({
            where : {
                id : invitation_id
            },
            data : {
                guest_email : email,
                guest_role : role
            }
        })

        return {
            message : 'Success'
        }

    } catch (error) {
        console.log(error)
    }

   
}