'use server'

import { z } from "zod"
import bcrypt from "bcrypt"
import UserModel from "@/lib/mongo/users"
import { createUser } from "@/server-actions/users"

const SignupFormSchema = z.object({
    email : z.string().email({
      message : 'Please enter a valid email address.'
    }),
    name : z.string().min(3,{
      message : 'Please enter a valid name'
    }),
    password : z.string().min(5, {
      message : 'Please type in a valid password'
    })
  })

  const SignUpValidateSession = SignupFormSchema.omit({})

  export async function registerNewUser(_prevstate, formData) {
    const validateFields = SignUpValidateSession.safeParse({
        email: formData.get("email"),
        name : formData.get("name"),
        password : formData.get("password"),
    })

    console.log("form data: ", formData.get("name"))
    
    if (!validateFields.success) {
        return {
          errors: validateFields.error.flatten().fieldErrors,
          message: 'Missing Fields',
        };
      }

     

      console.log("SUCESS", validateFields.success)
  
      const { name, email, password } = validateFields.data

      // check if email was taken
      const emailUsed = await UserModel.findOne({
        email : email
      })

      if (emailUsed) {
        return { message : 'Email is already registed'}
      }

      const hashedPassword = await bcrypt.hash(password, 5)
      const newUser = {name, password : hashedPassword, email}

      try {
        await createUser(newUser)
        return {
            message : 'Success'
        }
      } catch (e) {
        console.log(e)
        return {
            message : 'user registration failed'
        }
      }

  }