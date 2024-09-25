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
    team_id : z.string().min(1, {
        message: 'Please type in a valid id'
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

                const privilege = await checkPrivilege(invitations_id.split(",")[0])

                if (!privilege) {
                    return {
                        message : 'access denied'
                    }
                }
  
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

export async function checkPrivilege(invitation_id) {
    const session = await auth()
    
    try {
        const team = await prisma.member_invitation.findUnique({
            where : {
                id : invitation_id
            },
            select : {
                team_id : true
            }
        })

        const privilege = await prisma.user_privilege.findMany({
            where : {
                team_id : team.team_id,
                user_id : session?.user?.id,
                role : 'owner'
            }
        })

        if (privilege.length > 0) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }
}

export async function sendInvitation(_prevstate, formData) {

    console.log("INCOMMING FROM THE FORM: ", formData)

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

        const email_used = await prisma.member_invitation.findMany({
            where : {
                guest_email : email
            }
        })

        // Fetch all users belonging to the team and select their emails
        const existingTeamMembers = await prisma.user_privilege.findMany({
            where: {
                team_id: teamId
            },
            include: {
                user : true
            }
        });

        const existingEmails = existingTeamMembers.flatMap(member => member.user.email);

        if (existingEmails.filter(member_email => member_email === email).length > 0) {
            return {
                message: 'User already a member of this team'
            }
        }

        if (email_used.length > 0 ) {
            return {
                message : 'email already invited'
            }
        }

        const privilege = await checkRolePrivilege(teamId, role)

        if (!privilege) {
            return {
                message: 'access denied'
            }
        }

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

    const validatedFields = EditInvitationSession.safeParse({
        email : formData.get('email'),
        invitation_id : formData.get('invitation_id'),
        team_id : formData.get('team_id'),
        role : formData.get('role')
    })

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }

    const { email, invitation_id, team_id, role } = validatedFields.data
    
    try {   

        const privilege = await checkPrivilege(invitation_id)

        if (!privilege) {
            return {
                message : 'access denied'
            }
        }

        const rolePrivilege = await checkRolePrivilege(team_id, role)

        if (!rolePrivilege) {
            return {
                message: 'access denied'
            }
        }
        
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

// this function makes sure that non-authorized users 
// promote members to certain roles
export async function checkRolePrivilege(team_id, role) {
    const session = await auth()

    try {

        const account_status = await prisma.user_privilege.findMany({
            where : {
                team_id : team_id,
                user_id : session?.user?.id,
                status : 'active'
            }
        })

        if (account_status.length === 0) {
            return false
        }

        // check your role on this team:
        const my_role = await prisma.user_privilege.findMany({
            where: {
                user_id: session?.user?.id,
                team_id: team_id
            },
            select: {
                role: true
            }
        })

        // if you're nononwer, you can't delete others
        if (my_role[0].role !== 'owner') {
            return false
        }

        // check if the attempting deleter is the founding member
        const founding_member = await prisma.team.findUnique({
            where: {
                team_id: team_id,
                user_id: session?.user?.id
            }
        })

        // only the founding member can promoete to owner
        if (!founding_member && role === 'owner') {
            return false
        }
        
        if (my_role[0].role === 'owner' && !founding_member && role != 'owner') {
            return true
        }
        
        if (founding_member) {
            return true
        }

    } catch (error) {
        console.log(error)
    }
}