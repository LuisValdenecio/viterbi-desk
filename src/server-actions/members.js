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

const UpdateMemberRoleSchema = z.object({
    role: z.string().min(1, {
        message: 'Please type in a valid role'
    }),
    member_id: z.string().min(1, {
        message: 'Please type in a valid id'
    }),
    team_id: z.string().min(1, {
        message: 'Please type in a valid id'
    }),
})

const DeleteMemberSession = DeleteMemberFormSchema.omit({})
const UpdateMemberRoleSession = UpdateMemberRoleSchema.omit({})

export async function reassignMemberRole(_prevstate, formData) {
    const session = await auth()

    const validatedFields = UpdateMemberRoleSession.safeParse({
        role: formData.get('role'),
        member_id: formData.get('member_id'),
        team_id: formData.get('team_id'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields',
        };
    }

    const { role, member_id, team_id } = validatedFields.data

    try {

        // dont role-reassign the team founding member
        const isFoundingMember = await isFoundingMemberUser(member_id, team_id)
        if (isFoundingMember) {
            return {
                message: 'reassigning founder'
            }
        }

        const privilege = await checkRolePrivilege(team_id, member_id, role)

        if (!privilege) {
            return {
                message: 'access denied'
            }
        }

        const membership_id = await prisma.user_privilege.findMany({
            where : {
                user_id : member_id,
                team_id : team_id
            },
            select : {
                id : true
            }
        })

        const update_member = await prisma.user_privilege.update({
            where : {
                id : membership_id[0].id
            },
            data : {
                role : role
            }
        })

        return {
            message : 'Success'
        }

    } catch (error) {
        console.log(error)
    }
}

export async function deleteMember(_prevstate, formData) {

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
            where: {
                user_id: session?.user?.id
            }
        })

        if (user) {
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            )

            if (passwordMatch) {

                // dont delete team founding member
                const isFoundingMember = await isFoundingMemberUser(member_id, team_id)
                if (isFoundingMember) {
                    return {
                        message: 'deleting founder'
                    }
                }

                const privilege = await checkPrivilege(team_id, member_id)

                if (!privilege) {
                    return {
                        message: 'access denied'
                    }
                }

                const member_to_delete = await prisma.user_privilege.findMany({
                    where: {
                        user_id: member_id,
                        team_id: team_id
                    },
                    select: {
                        id: true
                    }
                })

                const deleted_member = await prisma.user_privilege.delete({
                    where: {
                        id: member_to_delete[0].id
                    }
                })

                return {
                    message: 'Success'
                }
            } else {
                return {
                    message: 'incorrect password'
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

// this function make sure that owners can promote readers and admins
// but only team owners can mess with owner
// this function makes sure that no one other than the team founder
// can delete owner members
export async function checkPrivilege(team_id, member_id) {
    const session = await auth()

    try {

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

        // if the user attempting to delete a member is not 
        // the founding member, he can't delete owners
        const member_role = await prisma.user_privilege.findMany({
            where: {
                user_id: member_id,
                team_id: team_id
            },
            select: {
                role: true
            }
        })

        // check if the attempting deleter is the founding member
        const founding_member = await prisma.team.findUnique({
            where: {
                team_id: team_id,
                user_id: session?.user?.id
            }
        })

        if (member_role[0].role === 'owner' && !founding_member) {
            return false
        }

        // this is the founding member, deleting an owner member
        if (member_role[0].role === 'owner' && founding_member) {
            return true
        }

        // owner members can delete readers and admins
        if (my_role[0].role === 'owner' && member_role[0].role !== 'owner') {
            return true
        }

    } catch (error) {
        console.log(error)
    }
}

// this function makes sure that non-authorized users 
// promote members to certain roles
export async function checkRolePrivilege(team_id, member_id, role) {
    const session = await auth()

    try {

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

        // if the user attempting to delete a member is not 
        // the founding member, he can't delete owners
        const member_role = await prisma.user_privilege.findMany({
            where: {
                user_id: member_id,
                team_id: team_id
            },
            select: {
                role: true
            }
        })

        // check if the attempting deleter is the founding member
        const founding_member = await prisma.team.findUnique({
            where: {
                team_id: team_id,
                user_id: session?.user?.id
            }
        })

        if (founding_member) {
            return true
        }

        // only the founding member can promoete to owner
        if (!founding_member && role === 'owner') {
            return false
        }
        
        // owner members can't promote or demote other owner members
        if (member_role[0].role === 'owner' && my_role[0].role === 'owner') {
            return false
        }

        // promoting a member to owner
        if (founding_member && role === 'owner') {
            return true
        }

        // owner members can delete readers and admins
        if (my_role[0].role === 'owner' && member_role[0].role !== 'owner' && role !== 'owner') {
            return true
        }

    } catch (error) {
        console.log(error)
    }
}


// this makes sure that the fouding member is not
// deleted by itself or any other member
export async function isFoundingMemberUser(user_id, team_id) {
    const session = await auth()

    const isTeamFounder = await prisma.team.findUnique({
        where: {
            team_id: team_id,
            user_id: user_id
        }
    })

    console.log("FOUNDING MEMBER: ", isTeamFounder)

    if (isTeamFounder) return true
    return false
}
