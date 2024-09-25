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
import { EyeIcon, KeySquare, Loader2,ShieldCheck } from "lucide-react"

import { useEffect } from 'react'
import { deleteMember, reactivateMember, reassignMemberRole, suspendMember } from '@/server-actions/members'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SubmitBtn from "@/components/submit-button";

import useSWR from 'swr'
//import { ListItemTable } from "../(components)/agents-list/tableOfItems"
import { ListItemTable } from "./(components)/people-list/tableOfItems"
import Loader_component from '@/components/loader'


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
  const { data: users, isLoading: usersLoading, error: usersError } = useSWR(`/api/allPeople/`, fetcher)
  const [deleteTeamMemberDialog, setDeleteTeamMemberDialog] = useState(false)
  const [reassignMemberRole, setReassignMemberRole ] = useState(false)
  const [suspendMember, setSuspendMember] = useState(false)
  const [reactivateMember, setReactivateMember] = useState(false)

  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if (searchParams.get('delete_member')?.toString()) {
      setDeleteTeamMemberDialog(true)
    } else if (searchParams.get('member')?.toString()) {
      setReassignMemberRole(true)
    } else if (searchParams.get('suspend')?.toString()) {
      setSuspendMember(true)
    } else if (searchParams.get('reactivate')?.toString()) {
      setReactivateMember(true)
    }
  }, [searchParams])

  const onDialogClose = () => {
    setDeleteTeamMemberDialog(false)
    setReassignMemberRole(false)
    setSuspendMember(false)
    setReactivateMember(false)
    params.delete('delete')
    params.delete('delete_member')
    params.delete('name')
    params.delete('member')
    params.delete('guest_email')
    params.delete('suspend')
    params.delete('reactivate')
    params.delete('edit')
    params.delete('role')
    params.delete('guest_role')
    replace(`${pathname}?${params.toString()}`);
  }

  if (usersError) return <div>falhou em carregar</div>
  if (usersLoading) return <Loader_component />
  console.log("MEMBER DATA: ", users.people)

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

            <div className="">
              <DeleteTeamMemberDialog open={deleteTeamMemberDialog} openChange={onDialogClose} />
              <ReassignMemberRole open={reassignMemberRole} openChange={onDialogClose} />
              <SuspendTeamMemberDialog open={suspendMember} openChange={onDialogClose} />
              <ReactivateTeamMemberDialog open={reactivateMember} openChange={onDialogClose} />
              <ListItemTable people={users.people} />
            </div>
        
      </div>
    </>

  )

}


/*************************************
 * THE FOLLOWING CONCERNS MEMBERSHIP
 ************************************/

const DeleteMemberFormSchema = z.object({
    password: z.string().min(1, {
      message: 'Please type in a valid password'
    }),
    member_id: z.string().min(1, {
      message: 'Please type in a valid agent id'
    }),
    team_id: z.string().min(1, {
      message: 'Please type in a valid agent id'
    }),
  })
  
  const UpdateMemberRoleSchema = z.object({
    role: z.string().min(1, {
        message: 'Please type in a valid role'
    }),
    member_id: z.string().min(1, {
        message: 'Please type in a valid id'
    }),
    team_id: z.string().min(1, {
        message: 'Please type in a valid id'
    }),
  })

  export function EditSubmitBtn({btnTitle}) {
    const { pending } = useFormStatus();
    return (
      <Button variant="destructive" type="submit" disabled={pending}>
        {pending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : btnTitle}
      </Button>
    )
  }
  
  export function DeleteTeamMemberDialog({ open, openChange }) {
  
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [member_id, setMember_id] = useState(searchParams.get('delete_member')?.toString())
  
    const initialState = {
      errors: {
        password: undefined,
        member_id: undefined,
        team_id : undefined
      },
      message: undefined
    };
  
    const initialValues: { password: string, member_id: string, team_id : string } = {
      password: "",
      member_id: searchParams.get('delete_member')?.toString(),
      team_id : searchParams.get('team')?.toString(),
    }
  
    const form = useForm<z.infer<typeof DeleteMemberFormSchema>>({
      resolver: zodResolver(DeleteMemberFormSchema),
      defaultValues: initialValues
    })
  
    const [state, formAction] = useFormState(deleteMember, initialState);
    const [incorrectPassword, setIncorrectPassword] = React.useState(false)
    const { toast } = useToast()
  
    React.useEffect(() => {
      console.log("STATE FROM SERVER: ", state)
      setMember_id(searchParams.get('delete_member')?.toString())
      setIncorrectPassword(false)
      if (state?.message == 'Success') {
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
        if (state?.message === 'incorrect password') {
          setIncorrectPassword(true)
        } else if (state?.message === 'access denied') {
          openChange()
          toast({
            title: "Operation blocked",
            description: `You don't have the privileges to complete this.`,
          })
        } else if (state?.message === 'deleting founder') {
          openChange()
          toast({
            title: "Operation blocked",
            description: `You attempting to delete the founding member`,
          })
        }
  
      }
    }, [state?.errors, searchParams]);
  
    return (
      <AlertDialog open={open} onOpenChange={openChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {searchParams.get('name')?.toString()}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This member will be permanently deleted from this team.
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
                name="team_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input defaultValue={searchParams.get('team')?.toString()} {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.password}</FormMessage>
                    {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="member_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input defaultValue={searchParams.get('delete_member')?.toString()} {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.password}</FormMessage>
                    {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
                  </FormItem>
                )}
              />
  
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <EditSubmitBtn btnTitle={"Delete"} />
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  
  export function ReassignMemberRole({ open, openChange }) {
  
    const pathname = usePathname()
    const searchParams = useSearchParams()
  
    const { toast } = useToast()
  
    const initialState = {
      errors: {
        role: undefined,
        member_id: undefined,
        team_id: undefined,
      },
      message: undefined
    };
  
    const [state, formAction] = useFormState(reassignMemberRole, initialState);
  
    useEffect(() => {
      console.log("STATE FROM SERVER: ", state)
      if (state?.message) {
        if (state?.message === 'Success') {
          openChange()
          toast({
            title: "Member reinstated",
            description: "Friday, February 10, 2023 at 5:57 PM",
          })
        }
  
        if (Array.isArray(state?.errors)) {
          state.errors.forEach((error) => {
            form.setError(error.field, { message: error.message });
          })
        } else if (state.message == 'access denied') {
            openChange()
            toast({
              title: "Operation blocked",
              description: `You don't have the privileges to complete this.`,
            })
        } else if (state.message == 'reassigning founder') {
          openChange()
            toast({
              title: "Operation blocked",
              description: `You can't re-assign the role of the team founder`,
            })
        }
      }
    }, [state?.errors]);
  
    const initialValues: { role: string, member_id: string, team_id: string } = {
      role: searchParams.get('role')?.toString(),
      member_id: searchParams.get('member')?.toString(),
      team_id: searchParams.get('team')?.toString(),
    };
  
    const form = useForm<z.infer<typeof UpdateMemberRoleSchema>>({
      resolver: zodResolver(UpdateMemberRoleSchema),
      defaultValues: initialValues
    })
  
    return (
      <Dialog open={open} onOpenChange={openChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{searchParams.get('name')?.toString()}</DialogTitle>
            <DialogDescription>
              Assign a new role for this member
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form action={formAction}>
            
              <FormField
                control={form.control}
                name="member_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input defaultValue={searchParams.get('member')?.toString()} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="team_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input defaultValue={searchParams.get('team')?.toString()} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
  
              <div className="grid gap-3 mb-4">
                <Label htmlFor="model">Role</Label>
                <Select name="role" defaultValue={searchParams.get('role')?.toString()}>
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
  
              <SubmitBtn>
                Update Role
              </SubmitBtn>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  
  }

  export function SuspendTeamMemberDialog({ open, openChange }) {

    const pathname = usePathname()
    const searchParams = useSearchParams()
  
    const initialState = {
      errors: {
        password: undefined,
        member_id: undefined,
        team_id : undefined
      },
      message: undefined
    };
  
    const initialValues: { password: string, member_id: string, team_id : string } = {
      password: "",
      member_id: searchParams.get('suspend')?.toString(),
      team_id : searchParams.get('team')?.toString()
    }
  
    const form = useForm<z.infer<typeof DeleteMemberFormSchema>>({
      resolver: zodResolver(DeleteMemberFormSchema),
      defaultValues: initialValues
    })
  
    const [state, formAction] = useFormState(suspendMember, initialState);
    const [incorrectPassword, setIncorrectPassword] = React.useState(false)
    const { toast } = useToast()
  
    React.useEffect(() => {
      console.log("STATE FROM SERVER: ", state)
      setIncorrectPassword(false)
      if (state?.message == 'Success') {
        openChange()
        toast({
          title: "Member Suspended",
          description: `This operation was successful`,
        })
      }
  
      if (Array.isArray(state?.errors)) {
        state.errors.forEach((error) => {
          form.setError(error.field, { message: error.message });
        })
      } else {
        if (state?.message === 'incorrect password') {
          setIncorrectPassword(true)
        } else if (state?.message === 'access denied') {
          openChange()
          toast({
            title: "Operation blocked",
            description: `You don't have the privileges to complete this.`,
          })
        } else if (state?.message === 'suspending founder') {
          openChange()
          toast({
            title: "Operation blocked",
            description: `You attempting to suspend the founding member`,
          })
        }
  
      }
    }, [state?.errors, searchParams]);
  
    return (
      <AlertDialog open={open} onOpenChange={openChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Suspend Membership
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. <b>{searchParams.get('name')?.toString()}</b> who currently holds the role of <b>{searchParams.get('role')?.toString()}</b> will be suspended from this team.
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
                name="team_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input defaultValue={searchParams.get('team')?.toString()} {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.password}</FormMessage>
                    {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="member_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input defaultValue={searchParams.get('suspend')?.toString()} {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.password}</FormMessage>
                    {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
                  </FormItem>
                )}
              />
  
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <EditSubmitBtn btnTitle={"Suspend"} />
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  
  export function ReactivateTeamMemberDialog({open, openChange}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
  
    const initialState = {
      errors: {
        password: undefined,
        member_id: undefined,
        team_id : undefined
      },
      message: undefined
    };
  
    const initialValues: { password: string, member_id: string, team_id : string } = {
      password: "",
      member_id: searchParams.get('reactivate')?.toString(),
      team_id : searchParams.get('team')?.toString()
    }
  
    const form = useForm<z.infer<typeof DeleteMemberFormSchema>>({
      resolver: zodResolver(DeleteMemberFormSchema),
      defaultValues: initialValues
    })
  
    const [state, formAction] = useFormState(reactivateMember, initialState);
    const [incorrectPassword, setIncorrectPassword] = React.useState(false)
    const { toast } = useToast()
  
    React.useEffect(() => {
      console.log("STATE FROM SERVER: ", state)
      setIncorrectPassword(false)
      if (state?.message == 'Success') {
        openChange()
        toast({
          title: "Member Reactivated",
          description: `This operation was successful`,
        })
      }
  
      if (Array.isArray(state?.errors)) {
        state.errors.forEach((error) => {
          form.setError(error.field, { message: error.message });
        })
      } else {
        if (state?.message === 'incorrect password') {
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
              Re-activate Membership
            </AlertDialogTitle>
            <AlertDialogDescription>
              <b>{searchParams.get('name')?.toString()}</b> who currently holds the role of <b>{searchParams.get('role')?.toString()}</b> will be reinstated to its role.
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
                name="team_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input defaultValue={searchParams.get('team')?.toString()} {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.password}</FormMessage>
                    {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="member_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input defaultValue={searchParams.get('reactivate')?.toString()} {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.password}</FormMessage>
                    {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
                  </FormItem>
                )}
              />
  
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <EditSubmitBtn btnTitle={"Reactivate"} />
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    )
  }