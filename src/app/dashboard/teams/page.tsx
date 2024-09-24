'use client'

import * as React from "react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
  
  } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useFormStatus } from "react-dom";
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
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useForm } from "react-hook-form"

import { deleteTeams, editTeam, getAllTeams } from '@/server-actions/teams'
import { ListItemTable } from './(components)/item-list/tableOfItems'
import { AcceptTeamInvitationDialog } from "./(components)/acceptTeamInvitationDialog"
import { useFormState } from "react-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import Loader_component from '@/components/loader'
import { useState } from 'react'
import { EyeIcon, KeySquare, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SubmitBtn from "@/components/submit-button";
import { sendInvitation } from "@/server-actions/invitations";

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Page() {

    const pathname = usePathname()
    const { replace } = useRouter()
    const searchParams = useSearchParams()
    const { data, isLoading, error } = useSWR('/api/allTeams', fetcher)
    const [editTeamDialog, setEditTeamDialog] = useState(false)
    const [deleteTeamDialog, setDeleteTeamDialog] = useState(false)
    const [addMemberDialog, setAddMemberDialog] = useState(false)

    const params = new URLSearchParams(searchParams);

    const onDialogClose = () => {
        setDeleteTeamDialog(false)
        setEditTeamDialog(false)
        setAddMemberDialog(false)
        params.delete('delete')
        params.delete('team_name')
        params.delete('edit')
        params.delete('member')
        params.delete('description')
        replace(`${pathname}?${params.toString()}`);
    }

    React.useEffect(() => {
        if (searchParams.get('delete')?.toString()) {
            setDeleteTeamDialog(true)
        } else if (searchParams.get('edit')?.toString()) {
            setEditTeamDialog(true)
        } else if (searchParams.get('member')?.toString()) {
            setAddMemberDialog(true)
        }
    }, [searchParams])

    if (error) return <div>falhou em carregar</div>
    if (isLoading) return <Loader_component />
    return (
        <>
            <DeleteTeamDialog open={deleteTeamDialog} openChange={onDialogClose} />
            <EditTeamDialog open={editTeamDialog} openChange={onDialogClose} />
            <AddMemberDialog open={addMemberDialog} openChange={onDialogClose} />
            <ListItemTable teams={data.teams} />
        </>
    )
}

const formSchema = z.object({
    password: z.string().min(1, {
        message: 'Please type in a valid password'
    }),
    teams_id: z.string().min(1, {
        message: 'Please type in a valid agent id'
    }),
})

const editFormSchema = z.object({
    name: z.string().min(1, {
        message: 'Please type in a valid password'
    }),
    description: z.string().min(1, {
        message: 'Please type in a valid team id'
    }),
})

const addMemberFormSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address.'
    }),
    role: z.string().min(1, {
        message: 'Please select a valid role'
    }),
    teamId: z.string().min(1, {
        message: 'Add a valid channel id'
    }),
})

export function EditTeamDialog({ open, openChange }) {

    const searchParams = useSearchParams()
    const { toast } = useToast()

    const initialState = {
        errors: {
            teamName: undefined,
            teamId: undefined,
            description: undefined,
        },
        message: undefined
    }

    const initialValues: { teamName: string, teamId: string, description: string } = {
        teamName: searchParams.get('team_name')?.toString(),
        teamId: searchParams.get('edit')?.toString(),
        description: searchParams.get('description')?.toString()
    }

    const form = useForm<z.infer<typeof editFormSchema>>({
        resolver: zodResolver(editFormSchema),
        defaultValues: initialValues
    })

    const [state, formAction] = useFormState(editTeam, initialState)

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
                    <DialogTitle>Edit team</DialogTitle>
                    <DialogDescription>
                        Modify the data and save your changes
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form action={formAction}>
                        <FormField
                            control={form.control}
                            name="teamName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input defaultValue={searchParams.get('team_name')?.toString()} autoFocus {...field} />
                                    </FormControl>
                                    <FormMessage>{state?.errors?.teamName}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="teamId"
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
                                Edit Team
                            </SubmitBtn>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export function DeleteTeamDialog({ open, openChange }) {

    const searchParams = useSearchParams()
    const [tasks_id, setTasks_id] = useState(searchParams.get('delete')?.toString())

    const initialState = {
        errors: {
            password: undefined,
            teams_id: undefined
        },
        message: undefined
    };

    const initialValues: { password: string, teams_id: string } = {
        password: "",
        teams_id: searchParams.get('delete')?.toString()
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues
    })

    const [state, formAction] = useFormState(deleteTeams, initialState);
    const [incorrectPassword, setIncorrectPassword] = React.useState(false)
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
                        {searchParams.get('team_name')?.toString()}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This task will no longer be
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
                                    <FormMessage>{state?.errors?.password}</FormMessage>
                                    {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="teams_id"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                    <FormControl>
                                        <Input type="text" defaultValue={searchParams.get('delete')?.toString()} {...field} />
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

export function AddMemberDialog({ open, openChange }) {
    const searchParams = useSearchParams()

    const { toast } = useToast()

    const initialState = {
        errors: {
            email: undefined,
            role: undefined,
            teamId: undefined,
        },
        message: undefined
    };

    const initialValues: { email: string, role: string, teamId: string } = {
        email: "",
        role: "",
        teamId: searchParams.get('member')?.toString()
    };

    const form = useForm<z.infer<typeof addMemberFormSchema>>({
        resolver: zodResolver(addMemberFormSchema),
        defaultValues: initialValues
    })

    const [state, formAction] = useFormState(sendInvitation, initialState);

    React.useEffect(() => {

        if (state?.message) {
            console.log("RETURNED STATE: ", state)
            if (state?.message === 'Success') {
                openChange()
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
            } else if (state?.message === 'access denied') {
                openChange()
                toast({
                    title: "Operation blocked",
                    description: "You lack privileges to perform this action",
                })
            } else if (state?.message === 'email already invited') {
                openChange()
                toast({
                    title: "Invitation already sent",
                    description: "This e-mail is already sent.",
                })
            } else if (state?.message === 'User already a member of this team') {
                openChange()
                toast({
                    title: "Operation blocked",
                    description: "User already a member of this team",
                })
            }

        }
    }, [state?.errors]);



    return (
        <Dialog open={open} onOpenChange={openChange}>

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
                                        <Input defaultValue={searchParams.get('member')?.toString()} {...field} />
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

                        <div className="grid gap-3 mb-4">
                            <Label htmlFor="model">Role</Label>
                            <Select name="role">
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
                            Send Invitation
                        </SubmitBtn>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 
