'use client'

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { PlusCircle, Loader2, Eye, PencilRuler, Zap, MoveUp, MoveDown, MoveRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { postPerson } from '@/server-actions/people'
import { usePathname } from 'next/navigation'


//@ts-ignore
import { useFormStatus } from "react-dom";
import { useFormState } from 'react-dom'
import { z } from "zod"
import { useEffect } from "react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Create Agent'}
    </Button>
  )
}

const formSchema = z.object({
    name : z.string().min(1,{
        message : 'Please enter a valid name for the team.'
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

export function CreatePersonDialog() {

  const path = usePathname()
  const router = useRouter()
  const teamId = path.split("/")[path.split("/").length - 1]

  const initialState = {
    errors: {
      name: undefined,
      team: undefined,
      role: undefined,
      email: undefined,
    },
    message: undefined
  };

  const initialValues: { name: string, team: string, role: string, email : string } = {
    name: "",
    team: teamId,
    role: "",
    email: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(postPerson, initialState);

  useEffect(() => {

    if (state?.message) {
      if (state?.message === 'Success') {
        router.push(`/dashboard/teams/${teamId}`)
      }
    }

    if (Array.isArray(state?.errors)) {
      state.errors.forEach((error) => {
        form.setError(error.field, { message: error.message });
      })
    }
  }, [state?.errors]);


  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New
        </Button>
          
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Person</DialogTitle>
            <DialogDescription>
              People invited to the team can access all of its channels, agents and tasks
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form action={formAction}>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="type in the name of the Person" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.name}</FormMessage>
                  </FormItem>
                )}
              />

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4">
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
                name="team"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Team id</FormLabel>
                    <FormControl>
                      <Input defaultValue={teamId} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              
              <SubmitBtn />
            </form>
          </Form>

        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" className="h-8 gap-1">

          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Agent
          </span>


        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form action={formAction} className="px-4">

            
            <SubmitBtn />
          </form>
        </Form>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
