'use server'

import prisma from "@/lib/prisma"
import { z } from "zod"
import { auth } from '@/auth'
import bcrypt from "bcrypt"

const TeamFormSchema = z.object({
    teamName : z.string().min(1,{
      message : 'Please enter a valid name for the team.'
    }),

    channels : z.string().min(1,{
      message : 'Please select a channel'
    }),
   
    description : z.string().min(1,{
      message : 'Please type in a description.'
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

export async function postTeam(_prevstate, formData) {
    console.log("FORM DATA: ", formData)
    const session = await auth()
    const channels = formData.get('channels').split(",")
    
    const validateFields = TeamCreationSession.safeParse({
        teamName : formData.get('teamName'),
        channels : formData.get('channels'),
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

      const teamChannel = channels.map((channel) => {
        return {
          channel_id : channel,
          team_id : newTeam.team_id
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

      const createManyTeamChannel = await prisma.team_channel.createMany({
        data : teamChannel
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

              const array_of_teams_ids = teams_id.split(",")
              const deleletedPosts = await prisma.team.deleteMany({
                  where : {
                      team_id : {
                          in : array_of_teams_ids
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

    const teams = myTeams.flatMap((team) => {
      return {
        team_id : team.team_id,
        name : team.team.name,
        description : team.team.description,
        user_id : team.id,
        user_role : team.role
      }
    })

    console.log(teams)

    return teams
  } catch(error) {
    console.log(error)
  }
}

