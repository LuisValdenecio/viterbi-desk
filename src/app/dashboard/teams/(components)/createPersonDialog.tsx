'use client'

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
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
import { Loader2, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendInvitation } from "@/server-actions/invitations"
import { ToastAction } from "@/components/ui/toast"

//@ts-ignore
import { useFormStatus } from "react-dom";
import { useFormState } from 'react-dom'
import { z } from "zod"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { usePathname } from "next/navigation"

export function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Send Invitation'}
    </Button>
  )
}

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }),
  teamId : z.string().min(1, {
    message: 'Add a valid channel id'
  }),
})

export function AddMemberDialog() {

  const path = usePathname()
  const teamId = path.split("/")[path.split("/").length - 1]
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { toast } = useToast()

  console.log("TEAM ID: ", teamId)

  const initialState = {
    errors: {
      email : undefined,
      teamId : undefined,
    },
    message: undefined
  };

  const initialValues: { email: string, teamId : string } = {
    email: "",
    teamId : teamId
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(sendInvitation, initialState);

  useEffect(() => {

    if (state?.message) {

      
      if (state?.message === 'Success') {
        setOpen(false)
        toast({
          title: "Scheduled: Catch up ",
          description: "Friday, February 10, 2023 at 5:57 PM",
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        })
      }
     
    }
  }, [state?.errors]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-8 gap-1" >

            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Member
            </span>


          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form action={formAction}>

            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Channel id</FormLabel>
                  <FormControl>
                    <Input defaultValue={teamId} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="type in the e-mail" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.email}</FormMessage>
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
        <Button variant="outline">Send Invitation</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <Form {...form}>
      <form action={formAction}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" defaultValue="shadcn@example.com" />
        </div>
        <Button type="submit">Send invitation</Button>
      </form>
    </Form>
  )
}
