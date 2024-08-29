'use server'

import TeamModel from "../lib/mongo/teams"
import { z } from "zod"

const TeamFormSchema = z.object({
    teamName : z.string().min(1,{
      message : 'Please enter a valid name for the team.'
    }),
    id : z.string().min(1,{
      message : 'Id assignment failed.'
    }),
    channel : z.string().min(1,{
      message : 'Invalid id for the channel'
    }),
    description : z.string().min(1,{
      message : 'Please type in a description.'
    }),
    status : z.string().min(1, {
      message : 'Status assignment failed'
    })
})

const TeamCreationSession = TeamFormSchema.omit({})

export async function postTeam(_prevstate, formData) {
    console.log(formData)

    const validateFields = TeamCreationSession.safeParse({
        teamName : formData.get('teamName'),
        id : "CH-3450",
        channel : '66ccd24550ccba4cb471d5fe',
        description : formData.get('description'),
        status : 'functioning'
      })
  
      if (!validateFields.success) {
        return {
          errors: validateFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
      }

      const {teamName, id, channel, description, status} = validateFields.data

      console.log(validateFields.data)
      console.log(validateFields.success)

      try {
        const newTeam = await TeamModel.create({teamName, id, channel, description, status})
        newTeam.save()

        return {
            message : 'Success',
            teamId : ""+newTeam._id
        }

      } catch (error) {
        console.log(error)
        return {errMsg : error.message}
      }

}

export async function getAllTeams() {
  try {
    const data = JSON.parse(
      JSON.stringify(
        await TeamModel
        .find()
        )
    )

    return data
  } catch(error) {
    console.log(error)
  }
}

