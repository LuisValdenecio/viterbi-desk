'use server'

import { z } from "zod"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth";

const LoginFormSchema = z.object({
  email : z.string().email({
    message : 'Please enter a valid email address.'
  }),
  password : z.string().min(3, {
    message : 'Please type in a valid password'
  })
})

const SignInValidateSession = LoginFormSchema.omit({})
//const CheckEmailValidadeSession = CheckUserEmailSchema.omit({})

export async function doSocialLogin(formData) {
    const action = formData.get('action')
    await signIn(action, {redirectTo : "/dashboard"})   
}

export async function doLogout() {
    await signOut({redirectTo : "/signin"})
}

export async function doCredentialLogin(_prevstate, formData) {
        
    const validateFields = SignInValidateSession.safeParse({
      email: formData.get("email"),
      password : formData.get("password"),
    })

    //const validateUserEmail = CheckEmailValidadeSession.safeParse({false})

    if (!validateFields.success) {
      return {
        errors: validateFields.error.flatten().fieldErrors,
        message: 'Missing Fields',
      };
    }

    const { email, password } = validateFields.data
  
    try {
      const response = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      })
  
      return {
        message : 'Success',
      }

    } catch (err) {
      if (err instanceof AuthError) {
        console.log(err.cause.err.message.split("Error:")[1])
        return { message: err.cause.err.message.split("Error:")[1] };
      }
      throw err;
    }
      
  }