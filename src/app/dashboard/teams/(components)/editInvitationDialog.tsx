'use client'

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import useSWR from 'swr'
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
import { Edit2Icon, EyeIcon, KeySquare, Loader2, PlusCircle, ShieldCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editInvitation, getInvitation, sendInvitation } from "@/server-actions/invitations"
import { ToastAction } from "@/components/ui/toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,

} from "@/components/ui/select"
import { Eye, PencilRuler, Zap, ClockIcon, MoveDown, MoveRight, MoveUp } from "lucide-react"


//@ts-ignore
import { useFormStatus } from "react-dom";
import { useFormState } from 'react-dom'
import { z } from "zod"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { usePathname } from "next/navigation"
import { OperationDeniedAlert } from "../../(components)/operationDenied"
import Loader_component from "@/components/loader"

export function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Invite'}
    </Button>
  )
}

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }),
  invitation_id: z.string().min(1, {
    message: 'Please type in a valid id'
  }),
  role: z.string().min(1, {
    message: 'Please select a valid role'
  }),
})

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function EditInvitationDialog({invitation_id}) {

  let invitation_to_edit : any = null;  

  const path = usePathname()
  const teamId = path.split("/")[path.split("/").length - 1]

  const { data: permission, isLoading: permissionLoading, error: permissionError } = useSWR(`/api/permissions/${teamId}`, fetcher)
  const [invitationData, setInvitationData] = React.useState("")

  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { toast } = useToast()

  const initialState = {
    errors: {
      email: undefined,
      invitation_id : undefined,
      role: undefined,
    },
    message: undefined
  };

  const [state, formAction] = useFormState(editInvitation, initialState);

  useEffect(() => {
    console.log("STATE: ", state)
    const fetchData = async () => {
      invitation_to_edit = await getInvitation(invitation_id)
      setInvitationData(invitation_to_edit)
      console.log("INVITATION TO EDIT: ", invitation_to_edit)
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });

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

      if (Array.isArray(state?.errors)) {
        state.errors.forEach((error) => {
          form.setError(error.field, { message: error.message });
        })
      }

    }
  }, [state?.errors]);

  const initialValues: { email: string, invitation_id : string, role: string } = {
    email: invitationData?.guest_email,
    invitation_id : invitation_id,
    role: invitationData?.guest_role
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  if (permissionError) return <div>falhou em carregar</div>
  if (permissionLoading) return <Loader_component />

  if (isDesktop) {

    if (permission === 'admin' || permission == 'owner') {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="font-normal h-8 lg:flex w-full flex justify-between border-none"
            >
                Edit 
              <Edit2Icon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Invitation</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form action={formAction}>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input defaultValue={invitationData?.guest_email}  type="email" placeholder="type in the e-mail" {...field} />
                      </FormControl>
                      <FormMessage>{state?.errors?.email}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invitation_id"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input defaultValue={invitation_id} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid gap-3 mb-4">
                  <Label htmlFor="model">Role</Label>
                  <Select name="role" defaultValue={invitationData?.guest_role}>
                    <SelectTrigger
                      id="model"
                      className="items-start [&_[data-description]]:hidden"
                    >
                      <SelectValue placeholder="Select a role for this invitation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <ShieldCheck className="size-5" />
                          <div className="grid gap-0.5">
                            <p>

                              <span className="font-medium text-foreground">
                                Admin
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Reads all the data and makes reports
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="reader">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <EyeIcon className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              <span className="font-medium text-foreground">
                                Reader
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Tasks run once stack is free
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="owner">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <KeySquare className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              <span className="font-medium text-foreground">
                                Owner
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              The tasks run ASAP
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                    <FormMessage>{state?.errors?.role}</FormMessage>
                  </Select>
                </div>


                <SubmitBtn />
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )
    } else {
      return (
        <OperationDeniedAlert>
            <Button size="sm" className="h-8 gap-1" >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Member
              </span>
            </Button>
        </OperationDeniedAlert>
      )
    }
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
    <h1></h1>
  )
}
