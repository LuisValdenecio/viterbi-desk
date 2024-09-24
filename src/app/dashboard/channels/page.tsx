
'use client'

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ListItemTable } from './(components)/item-list/tableOfItems'
import useSWR from 'swr'
import Loader_component from "@/components/loader"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import SubmitBtn from "@/components/submit-button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react'
import { useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { ToastAction } from "@/components/ui/toast"
import { deleteChannels, editChannel } from "@/server-actions/channels"
import { useToast } from "@/components/ui/use-toast"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Page() {

  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const [editChannelialog, setEditChannelDialog] = useState(false)
  const [deleteChannelDialog, setDeleteChannelDialog] = useState(false)
  const { data, isLoading, error } = useSWR('/api/allChannels', fetcher)

  const params = new URLSearchParams(searchParams);

  const onDialogClose = () => {
    setDeleteChannelDialog(false)
    setEditChannelDialog(false)
    params.delete('delete')
    params.delete('channel_name')
    params.delete('edit')
    params.delete('description')
    replace(`${pathname}?${params.toString()}`);
  }

  React.useEffect(() => {
    if (searchParams.get('delete')?.toString()) {
      setDeleteChannelDialog(true)
    } else if (searchParams.get('edit')?.toString()) {
      setEditChannelDialog(true)
    }
  }, [searchParams])

  if (error) return <div>falhou em carregar</div>
  if (isLoading) return <Loader_component />
  return (
    <>
      <DeleteChannelialog open={deleteChannelDialog} openChange={onDialogClose} />
      <EditChannelDialog open={editChannelialog} openChange={onDialogClose} />
      <ListItemTable channels={data.filtered} />
    </>
  )
}

const formSchema = z.object({
  password: z.string().min(1, {
    message: 'Please type in a valid password'
  }),
  channels_ids: z.string().min(1, {
    message: 'Please type in a valid agent id'
  }),
})

const editFormSchema = z.object({
  channelName: z.string().min(1, {
      message: 'Please type in a valid password'
  }),
  channelId : z.string().min(1, {
      message: 'Please type in a valid agent id'
  }),
  description: z.string().min(1, {
      message: 'Please type in a valid team id'
  }),
})

export function EditChannelDialog({ open, openChange }) {

  const searchParams = useSearchParams()
  const { toast } = useToast()

  const initialState = {
      errors: {
          channelName: undefined,
          channelId: undefined,
          description: undefined,
      },
      message: undefined
  }

  const initialValues: { channelName: string, channelId: string, description: string } = {
      channelName: searchParams.get('team_name')?.toString(),
      channelId: searchParams.get('edit')?.toString(),
      description: searchParams.get('description')?.toString()
  }

  const form = useForm<z.infer<typeof editFormSchema>>({
      resolver: zodResolver(editFormSchema),
      defaultValues: initialValues
  })

  const [state, formAction] = useFormState(editChannel, initialState)

  React.useEffect(() => {
      if (state.message == 'Success') {
          openChange()
          toast({
              title: "Team removed",
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
      } else if (state?.message === 'access denied') {
        openChange()
        toast({
          title: "Operation blocked",
          description: `You don't have the privileges to complete this.`,
        })
    }
  }, [state?.errors]);

  return (
      <Dialog open={open} onOpenChange={openChange}>
          <DialogContent className="sm:max-w-[475px]">
              <DialogHeader>
                  <DialogTitle>Edit Channel</DialogTitle>
                  <DialogDescription>
                      Modify the data and save your changes
                  </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                  <form action={formAction}>
                      <FormField
                          control={form.control}
                          name="channelName"
                          render={({ field }) => (
                              <FormItem>
                                  <FormControl>
                                      <Input defaultValue={searchParams.get('channel_name')?.toString()} autoFocus {...field} />
                                  </FormControl>
                                  <FormMessage>{state?.errors?.agentName}</FormMessage>
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="channelId"
                          render={({ field }) => (
                              <FormItem className="hidden">
                                  <FormLabel>Channel id</FormLabel>
                                  <FormControl>
                                      <Input defaultValue={searchParams.get('edit')?.toString()} {...field} />
                                  </FormControl>
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                              <FormItem>
                                  <FormControl className="mt-4">
                                      <Textarea defaultValue={searchParams.get('description')?.toString()} {...field} />
                                  </FormControl>
                                  <FormMessage>{state?.errors?.description}</FormMessage>
                              </FormItem>
                          )}
                      />
                      <div className="mt-4">
                          <SubmitBtn>
                              Edit Channel
                          </SubmitBtn>
                      </div>
                  </form>
              </Form>
          </DialogContent>
      </Dialog>
  )
}


export function DeleteChannelialog({ open, openChange }) {

  const searchParams = useSearchParams()
  const [tasks_id, setTasks_id] = useState(searchParams.get('delete')?.toString())

  const initialState = {
    errors: {
      password: undefined,
      channels_ids: undefined
    },
    message: undefined
  };

  const initialValues: { password: string, channels_ids: string } = {
    password: "",
    channels_ids: searchParams.get('delete')?.toString()
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(deleteChannels, initialState);
  const [incorrectPassword, setIncorrectPassword] = React.useState<boolean>(false)
  const { toast } = useToast()

  React.useEffect(() => {
    setTasks_id(searchParams.get('delete')?.toString())
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
      } else if (state?.message === 'access denied') {
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
            {searchParams.get('channel_name')?.toString()}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This channel and all its dependencies will no longer be
            accessible by you or others you&apos;ve shared it with.
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
                  {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="channels_ids"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="text" defaultValue={searchParams.get('delete')?.toString()} {...field} />
                  </FormControl>
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