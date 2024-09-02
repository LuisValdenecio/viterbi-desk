'use server'

import { z } from "zod"
import bcrypt from "bcrypt"
import prisma from "../lib/prisma";

const SignupFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }),
  name: z.string().min(3, {
    message: 'Please enter a valid name'
  }),
  password: z.string().min(5, {
    message: 'Please type in a valid password'
  })
})

const SignUpValidateSession = SignupFormSchema.omit({})

export async function registerNewUser(_prevstate, formData) {
  const validateFields = SignUpValidateSession.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  })

  console.log("form data: ", formData.get("name"))

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: 'Missing Fields',
    };
  }

  const { name, email, password } = validateFields.data

  // check if email was taken
  const emailUsed = await prisma.user.findFirst({
    where: {
      email: email
    }
  })

  if (emailUsed) {
    return { message: 'Email is already registed' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    //await createUser(newUser)
    const newUser = await prisma.user.create({
      data: {
        name : name,
        email : email,
        password : hashedPassword
      }
    })

    return {
      message: 'Success',
      user: newUser
    }
  } catch (e) {
    console.log(e)
    return {
      message: 'user registration failed'
    }
  }

}