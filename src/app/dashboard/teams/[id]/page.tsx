'use client'

import * as React from "react"

import { useFormStatus } from "react-dom";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BreadCrumpComponent } from '@/components/breadcrump'
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useFormState } from "react-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { Loader2, MoveDown, MoveRight, MoveUp } from "lucide-react"

import { useEffect } from 'react'
import { deleteTaks, editTask } from '@/server-actions/tasks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,

} from "@/components/ui/select"
import SubmitBtn from "@/components/submit-button";

import useSWR from 'swr'
//import { ListItemTable } from "../(components)/agents-list/tableOfItems"
import { ListItemTable } from "../(components)/people-list/tableOfItems"
import { ListInvitees } from "../(components)/invitees-list/tableOfItems"
import { AddMemberDialog } from "../(components)/createPersonDialog"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Loader_component from '@/components/loader'
import { deleteInvitations } from "@/server-actions/invitations";
//import { Overview } from '../(components)/overview/overview'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function fetchTeamData(url) {
  const { data, error, isLoading } = useSWR(url, fetcher)

  return {
    channel: data,
    isLoadingFromChannelFetch: isLoading,
    isErrorFromChannelFetch: error
  }
}

export default function Page() {

  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const teamId = pathname.split("/")[pathname.split("/").length - 1]
  const { data : users, isLoading : usersLoading, error : usersError } = useSWR(`/api/people/${teamId}`, fetcher)
  const { data : invitees, isLoading : inviteesLoading, error : inviteesError } = useSWR(`/api/invitees/${teamId}`, fetcher)
  const [deleteInvitationDialog, setDeleteInvitationDialog] = useState(false)
  const [editInvitationDialog, setEditInvitationDialog] = useState(false)

  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if (searchParams.get('delete')?.toString()) {
      setDeleteInvitationDialog(true)
    } else if (searchParams.get('edit')?.toString()) {
      setEditInvitationDialog(true)
    }
  }, [searchParams])

  const onDialogClose = () => {
    setDeleteInvitationDialog(false)
    setEditInvitationDialog(false)
    params.delete('delete')
    params.delete('guest_email')
    params.delete('edit')
    params.delete('guest_role')
    replace(`${pathname}?${params.toString()}`);
  }

  if (usersError || inviteesError) return <div>falhou em carregar</div>
  if (usersLoading || inviteesLoading) return <Loader_component />
  
  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Tabs defaultValue="active">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="active">Members</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" >
            
          </TabsContent>
          <TabsContent value="active">
            <div className="">
              <ListItemTable people={users.people} />
            </div>
          </TabsContent>

          <TabsContent value="invitations">
            <div className="">
              <DeleteInvitationDialog open={deleteInvitationDialog} openChange={onDialogClose} />
              <ListInvitees invitees={invitees.invitees_data} />
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </>

  )

}

const formSchema = z.object({
  password: z.string().min(1, {
    message: 'Please type in a valid password'
  }),
  invitations_id: z.string().min(1, {
    message: 'Please type in a valid agent id'
  }),
})

export function DeleteInvitationDialog({ open, openChange }) {

  const searchParams = useSearchParams()
  const [invitations_id, setInvitations_id] = useState(searchParams.get('delete')?.toString())
  console.log("INVITATION TO DELETE:", searchParams.get('delete')?.toString())

  const initialState = {
    errors: {
      password: undefined,
      invitations_id: undefined
    },
    message: undefined
  };

  const initialValues: { password: string, invitations_id: string } = {
    password: "",
    invitations_id: searchParams.get('delete')?.toString()
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(deleteInvitations, initialState);
  const [incorrectPassword, setIncorrectPassword] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    setInvitations_id(searchParams.get('delete')?.toString())
    setIncorrectPassword(false)
    if (state.message == 'Success') {
      openChange()
      toast({
        title: "Task removed",
        description: `The task was delted successfully`,
        action: (
          <ToastAction altText="Refresh">Undo</ToastAction>
        ),
      })
    }

    if (Array.isArray(state?.errors)) {
      state.errors.forEach((error) => {
        form.setError(error.field, { message: error.message });
      })
    } else {
      if (state.message === 'incorrect password') {
        setIncorrectPassword(true)
      } else if (state.message == 'access denied') {
        openChange()
        toast({
          title: "Operation blocked",
          description: `You don't have the privileges to complete this.`,
        })
      }

    }
  }, [state?.errors, searchParams]);

  return (
    <AlertDialog open={open} onOpenChange={openChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {searchParams.get('guest_email')?.toString()}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The invitation link will be inactive permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form action={formAction} className="grid items-start gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="type in your password" {...field} />
                  </FormControl>
                  <FormMessage>{state?.errors?.password}</FormMessage>
                  {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invitations_id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input defaultValue={[invitations_id].join(",")} {...field} />
                  </FormControl>
                  <FormMessage>{state?.errors?.password}</FormMessage>
                  {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <EditSubmitBtn />
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function EditSubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button variant="destructive" type="submit" disabled={pending}>
      {pending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : "Delete"}
    </Button>
  )
}