'use server'

import PersonModel from "../lib/mongo/person"
import { z } from "zod"

const PersonFormSchema = z.object({
    name : z.string().min(1,{
      message : 'Please enter a valid name for the invitee.'
    }),
    team : z.string().min(1,{
      message : 'Id assignment failed.'
    }),
    role : z.string().min(1,{
      message : 'Please select a role'
    }),
    email : z.string().email({
        message : 'Please enter a valid email address.'
    }),
})

const PersonCreationSession = PersonFormSchema.omit({})

export async function postPerson(_prevstate, formData) {
    console.log(formData)

    const validateFields = PersonCreationSession.safeParse({
        name : formData.get("name"),
        team : formData.get("team"),
        role : "admin",
        email : formData.get("email")
    })

    if (!validateFields.success) {
        return {
          errors: validateFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
    }

    const { name, team, role, email } = validateFields.data

    try {
      const newPerson = await PersonModel.create({name, team, email, role})
      newPerson.save()

      return {
        message : 'Success'
      }

    } catch(error) {
      console.log(error)
    }


    console.log(validateFields.success)
}