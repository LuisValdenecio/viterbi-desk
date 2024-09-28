import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { randomUUID } from 'crypto'

export const POST = async (req, { params }) => {
    const session = await auth()
    const results = await req.json()
    console.log("DATA: ", results)
    console.log("ROUTE:", params.route)

    try {

        switch (params.route) {

            case 'teams':

                const team_names = results.results.flatMap(team => team.name)

                const my_teams = await prisma.user_privilege.findMany({
                    where: {
                        user_id: session?.user?.id
                    },
                    select: {
                        team_id: true
                    }
                })

                const my_teams_id = my_teams.flatMap(team => team.team_id)

                const check_repeated_names = await prisma.team.findMany({
                    where: {
                        name: {
                            in: team_names
                        },
                        team_id: {
                            in: my_teams_id
                        }
                    },
                    select: {
                        name: true
                    }
                })

                if (check_repeated_names.length > 0) {
                    return Response.json(`Repeated: ${check_repeated_names[0].name}`)
                }

                const teams = results.results.map((team) => {
                    return {
                        name: team.name,
                        description: team.description
                    }
                })

                teams.forEach(async team => {
                    const team_saved = await prisma.team.create({
                        data: {
                            name: team.name,
                            description: team.description,
                            user_id: session?.user?.id
                        }
                    })

                    const team_membership = await prisma.user_privilege.create({
                        data: {
                            role: 'owner',
                            status: 'active',
                            user_id: session?.user?.id,
                            team_id: team_saved.team_id
                        }
                    })
                })

                return Response.json("teams saved")

            case 'agents':

                break

            case 'members':
                const teamId = results.teamId

                const my_role_onthis_team = await prisma.user_privilege.findMany({
                    where: {
                        user_id: session?.user?.id,
                        team_id: teamId
                    },
                    select: {
                        role: true
                    }
                })

                if (my_role_onthis_team[0].role === 'admin' || my_role_onthis_team[0].role === 'reader') {
                    return Response.json('You lack privileges')
                } else {

                    const invited_members_email = results.results.flatMap(team => team.email)

                    // fetch all invited members into this team
                    const invited_members = await prisma.member_invitation.findMany({
                        where: {
                            team_id: teamId,
                            guest_email: {
                                in: invited_members_email
                            }
                        },
                        select: {
                            guest_email: true
                        }
                    })

                    // checks to see if we are double inviting a member
                    if (invited_members.length > 0) {
                        if (invited_members.length > 1) {
                            return Response.json('Resending invitations')
                        } else {
                            return Response.json(`Repeated invite: ${invited_members[0].guest_email}`)
                        }
                    }

                    const inviting_registered_members = await prisma.user_privilege.findMany({
                        where: {
                            team_id: teamId
                        },
                        include: {
                            user: {
                                where: {
                                    email: {
                                        in: invited_members_email
                                    }
                                }
                            }
                        }
                    })

                    // number of invitations sent to registered memebrs
                    const numb_of_redundant_invitations = inviting_registered_members.filter(member => member.user).length
                    if (numb_of_redundant_invitations > 0) {
                        if (numb_of_redundant_invitations > 1) {
                            return Response.json('Already registered')
                        } else {
                            return Response.json(`Already registered: ${inviting_registered_members[0].user.email}`)
                        }
                    }

                    // check if you are the team founder
                    const team_founder = await prisma.team.findUnique({
                        where: {
                            team_id: teamId,
                            user_id: session?.user?.id
                        }
                    })

                    const invited_members_role = results.results.flatMap(team => team.role)

                    if (team_founder) {
                        // invite the team members
                        results.results.forEach(async (invitation) => {

                            const invitation_token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '')

                            const member_invitation = await prisma.member_invitation.create({
                                data: {
                                    guest_email: invitation.email,
                                    guest_role: invitation.role,
                                    team_id: teamId,
                                }
                            })

                            const invitation_info = await prisma.invitation_info.create({
                                data: {
                                    invitation_info: member_invitation.id,
                                    inviter_id: session?.user?.id
                                }
                            })

                            const invitation_link = await prisma.invitation_link.create({
                                data: {
                                    token: invitation_token,
                                    link: `http://localhost:3000/api/team-invitation/${invitation_token}`,
                                    invitation_id: member_invitation.id
                                }
                            })
                        })

                        return Response.json("members invited")

                    } else {
                        // invite the team membes, provided that none of the is an owner
                        if (invited_members_role.filter(role => role === 'owner').length > 0) {
                            return Response.json('inviting owner')
                        }

                        // invite the team members
                        results.results.forEach(async (invitation) => {

                            const invitation_token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '')

                            const member_invitation = await prisma.member_invitation.create({
                                data: {
                                    guest_email: invitation.email,
                                    guest_role: invitation.role,
                                    team_id: teamId,
                                }
                            })

                            const invitation_info = await prisma.invitation_info.create({
                                data: {
                                    invitation_info: member_invitation.id,
                                    inviter_id: session?.user?.id
                                }
                            })

                            const invitation_link = await prisma.invitation_link.create({
                                data: {
                                    token: invitation_token,
                                    link: `http://localhost:3000/api/team-invitation/${invitation_token}`,
                                    invitation_id: member_invitation.id
                                }
                            })
                        })

                        return Response.json("members invited")
                    }
                }

            default:
                break
        }


        //return Response.json(resultData)
    } catch (e) {
        console.log(e)
        return new NextResponse("couldnt updload", {
            status: 500
        })
    }
    return new NextResponse("data saved", {
        status: 201
    })

}

