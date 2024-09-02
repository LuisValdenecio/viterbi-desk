'use server'

import prisma from "@/lib/prisma"
import { z } from "zod"
import { auth } from '@/auth'

const TeamFormSchema = z.object({
    teamName : z.string().min(1,{
      message : 'Please enter a valid name for the team.'
    }),
   
    description : z.string().min(1,{
      message : 'Please type in a description.'
    }),
})

const TeamCreationSession = TeamFormSchema.omit({})

export async function postTeam(_prevstate, formData) {
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
          privilege : 'Owner',
          status : 'active',
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

export async function getAllTeams() {
  try {
    const data = await prisma.team.findMany()
    return data
  } catch(error) {
    console.log(error)
  }
}

