'use server'

import prisma from '@/lib/prisma'
import { z } from "zod"
import { auth } from '@/auth'
import { randomUUID } from 'crypto'
import bcrypt from "bcrypt"

const DeleteMemberFormSchema = z.object({
    password: z.string().min(1, {
      message: 'Please type in a valid password'
    }),
    member_id: z.string().min(1, {
      message: 'Please type in a valid agent id'
    }),
    team_id: z.string().min(1, {
      message: 'Please type in a valid agent id'
    }),
})

const DeleteMemberSession = DeleteMemberFormSchema.omit({})

export async function deleteMember(_prevstate, formData) {

    console.log("COMMMING FROM THE CLIENT: ", formData)
    const session = await auth()

    const validatedFields = DeleteMemberSession.safeParse({
        password: formData.get('password'),
        member_id: formData.get('member_id'),
        team_id: formData.get('team_id'),
    })

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }
  
    const { password, member_id, team_id } = validatedFields.data

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

                // dont delete team founding member
                const isFoundingMember = await deletingFounderMember(member_id, team_id)
                if (isFoundingMember) {
                    return {
                        message : 'deleting founder'
                    }
                }

                const member_to_deete = await prisma.user_privilege.findMany({
                    where : {
                       user_id : member_id,
                       team_id : team_id
                    },
                    select : {
                        id : true
                    }
                })

                const deleted_member = await prisma.user_privilege.delete({
                    where : {
                        id : member_to_deete[0].id
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

// this function makes sure that no one other than the team founder
// can delete owner members
export async function checkPrivilege(team_id, member_id) {
    const session = await auth()
    
    try {




    } catch (error) {
        console.log(error)
    }
}

// this makes sure that the fouding member is not
// deleted by itself or any other member
export async function deletingFounderMember(user_id, team_id) {
    const session = await auth()

    const isTeamFounder = await prisma.team.findUnique({
        where : {
            team_id : team_id,
            user_id : user_id
        }
    })

    console.log("FOUNDING MEMBER: ", isTeamFounder)

    if (isTeamFounder) return true
    return false
}