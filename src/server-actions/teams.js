'use server'

import prisma from "@/lib/prisma"
import { z } from "zod"
import { auth } from '@/auth'
import bcrypt from "bcrypt"

const TeamFormSchema = z.object({
    teamName : z.string().min(1,{
      message : 'Please enter a valid name for the team.'
    }),
   
    description : z.string().min(1,{
      message : 'Please type in a description.'
    }),
})

const TeamUpdateFormSchema = z.object({
  teamName: z.string().min(1, {
    message: 'Please enter a valid name for the team.'
  }),
  teamId: z.string().min(1, {
    message: 'Please enter a valid id for the team.'
  }),
  description: z.string().min(1, {
    message: 'Please select a valid description.'
  }),
})


const DeleteTeamFormSchema = z.object({
  password: z.string().min(1, {
      message: 'Please type in a valid password'
  }),
  teams_id: z.string().min(1, {
      message: 'Please type in a valid team id'
  }),
})

const TeamCreationSession = TeamFormSchema.omit({})
const DeleteTeamSession = DeleteTeamFormSchema.omit({})
const UpdateTeamSession = TeamUpdateFormSchema.omit({})

export async function getTeam(team_id) {
  try { 
    const team = prisma.team.findUnique({
      where : {
        team_id
      },
      select : {
        name : true,
        description : true
      }
    })
    return team
  } catch (error) {
    console.log(error)
  }
}

export async function editTeam(_prevstate, formData) {
  
  const validatedFields = UpdateTeamSession.safeParse({
    teamName : formData.get('teamName'),
    teamId : formData.get('teamId'),
    description : formData.get('description')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields',
    }
  }

  const {teamName, teamId, description} = validatedFields.data

  try {

    const privilege = await checkPrivilege(teamId)

    if (!privilege) {
      if (_prevstate?.message === 'access denied') {
        return {
            message: 'access denied',
            retryTime : new Date()
        }
      } else {
          return {
              message: 'access denied'
          }
      }
    }

    const editedTeam = await prisma.team.update({
      where :  {
        team_id : teamId
      },
      data : {
        name : teamName,
        description
      }
    }) 
    
    if (_prevstate?.message === 'Success') {
      return {
          message: 'Success',
          retryTime : new Date()
      }
    } else {
        return {
          message: 'Success',
        }
    }

  } catch (error) {
    console.log(error)
    return {
      message : 'something went wrong'
    }
  }
}

export async function checkPrivilege(team_id) {
  const session = await auth()
  const privilege = await prisma.user_privilege.findMany({
    where : {
      user_id : session?.user?.id,
      team_id : team_id,
      role : 'owner'
    }
  })

  return privilege.length
}

export async function postTeam(_prevstate, formData) {
    console.log("FORM DATA: ", formData)
    const session = await auth()
    
    const validateFields = TeamCreationSession.safeParse({
        teamName : formData.get('teamName'),
        description : formData.get('description'),
    })

    if (!validateFields.success) {
      return {
        errors: validateFields.error.flatten().fieldErrors,
        message: 'Missing Fields',
      };
    }

    const {teamName, description} = validateFields.data

    try {

      const newTeam = await prisma.team.create({
        data : {
          name : teamName,
          description : description,
          user_id : session?.user?.id
        }
      })

      const user_privelege = await prisma.user_privilege.create({
        data : {
          role : 'owner',
          status : 'active',  // is it necessary??
          user_id : session?.user?.id,
          team_id : newTeam.team_id
        }
      })

    
      return {
          message : 'Success',
          teamId : ""+newTeam.team_id
      }

    } catch (error) {
      console.log(error)
      return {errMsg : error.message}
    }

}

export async function deleteTeams(_prevstate, formData) {

  console.log("PREV STATE: ", _prevstate)
  const session = await auth()

  const validatedFields = DeleteTeamSession.safeParse({
      password : formData.get('password'),
      teams_id : formData.get('teams_id')
  })

  if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields',
      };
  }

  const { password, teams_id } = validatedFields.data

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

              const privilege = await checkPrivilege(teams_id.split(",")[0])
              if (!privilege) {
                if (_prevstate?.message === 'access denied') {
                  return {
                    message : 'access denied-second',
                    retryTime : new Date()
                  }
                } else {
                  return {
                    message : 'access denied',
                  }
                }
              }

              const array_of_teams_ids = teams_id.split(",")
              const deleletedPosts = await prisma.team.deleteMany({
                  where : {
                      team_id : {
                          in : array_of_teams_ids
                      }
                  }
              })
              
              if (_prevstate?.message === 'Success') {
                return {
                  message : 'Success-second',
                  retryTime : new Date()
                }
              } else {
                return {
                    message : 'Success'
                }
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


export async function getAllTeams() {
  const session = await auth()
  try {

    const myTeams = await prisma.user_privilege.findMany({
      where : {
        user_id : session?.user?.id
      },
      include : {
        team : true
      }
    })

    const teams_ids = myTeams.flatMap(team => team.team_id)

    const members_in_teams = await prisma.user_privilege.findMany({
      where : {
        team_id : {
          in : teams_ids
        } 
      }
    })

    const members = await members_in_teams.flatMap((team) => {
      return {
        team_id : team.team_id,
        members : members_in_teams.filter(currentTeam => currentTeam.team_id === team.team_id).length
      }
    })

    const unique_members = members.filter((value, index) => 
      members.findIndex((team) => team.team_id == value.team_id) == index
    )

    const teams = myTeams.flatMap((team) => {
      return {
        team_id : team.team_id,
        name : team.team.name,
        members : unique_members.filter(currentTeam => currentTeam.team_id == team.team_id)[0].members,
        description : team.team.description,
        user_id : team.id,
        user_role : team.role
      }
    })

    return teams
  } catch(error) {
    console.log(error)
  }
}

