'use client';

import Image from "next/image"
import Link from "next/link"
import { doSocialLogin } from "@/server-actions/authentication";
import { registerNewUser } from "@/server-actions/user-registration"
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"

//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { doCredentialLogin } from '@/server-actions/authentication'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

//@ts-ignore
import { useFormStatus } from "react-dom";
import { useFormState } from 'react-dom'
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from '@/components/loading-button';

const formSchema = z.object({
  email: z.string().email({
    message: "Please, insert a valid email",
  }),

  name: z.string().min(1, {
    message: "Please, insert a valid name",
  }),

  password: z.string().min(1, {
    message: "Username must be at least 2 characters.",
  }),

})

export function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Sign up'}
      </Button>
  )
}


export function SignUpForm() {

  const { pending } = useFormStatus()
  const router = useRouter()

  const initialState = {
    errors: {
      email: undefined,
      name : undefined,
      password: undefined
    },
    message: undefined
  };

  const initialValues : {email : string, name : string, password : string} = {
    email: "",
    name : "",
    password: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(registerNewUser, initialState);
  const [wrongPassword, setWrongPassword] = useState(false)

  useEffect(() => {
    if (!state?.errors) {
      router.push('/signin')
    }

    console.log(state?.errors)

    if (state?.message === 'Password is not correct') {
      setWrongPassword(true)
    }

    if (Array.isArray(state?.errors)) {
      // Check if state.errors is an array before iterating
      
      state.errors.forEach((error) => {
        form.setError(error.field, { message: error.message });
      });
    }
  }, [state?.errors]);

  return (
    <div className="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign up for an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form action={formAction} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@example.com" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.email}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.name}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.password}</FormMessage>
                  </FormItem>
                )}
              />
              <SubmitBtn />
            </form>
          </Form>

          
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white dark:bg-gray-900 px-6 text-gray-900 dark:text-white">Or continue with</span>
            </div>
          </div>

          <form action={doSocialLogin}>
            <Button variant="outline" className="flex w-full items-center justify-center gap-3" type="submit"
              name="action" value="google">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              <span className="text-sm font-semibold leading-6">Google</span>
            </Button>
          </form>



          <div className="mt-4 text-center text-sm">
           Already have an account?{" "}
            <Link href={"/signin"} className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
