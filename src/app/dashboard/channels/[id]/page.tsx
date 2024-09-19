'use client'

import * as React from "react"
import { deleteAgents, editAgent, getMyAgents } from '@/server-actions/agents'
import useSWR from 'swr'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
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
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { useFormState } from "react-dom"
import Loader_component from "@/components/loader"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import SubmitBtn from "@/components/submit-button"
import { Textarea } from "@/components/ui/textarea"
import { ListItemTable } from "../(components)/agent-list-with-select/tableOfItems"
import { CreateAgentDialog } from "../(components)/createAgentDialog"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function fetchChannelData(url) {
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
    const [editAgentialog, setEditAgentDialog] = useState(false)
    const [deleteAgentDialog, setDeleteAgentDialog] = useState(false)

    const params = new URLSearchParams(searchParams);

    const onDialogClose = () => {
        setDeleteAgentDialog(false)
        setEditAgentDialog(false)
        params.delete('delete')
        params.delete('agent_name')
        params.delete('edit')
        params.delete('description')
        replace(`${pathname}?${params.toString()}`);
    }

    React.useEffect(() => {
        if (searchParams.get('delete')?.toString()) {
            setDeleteAgentDialog(true)
        } else if (searchParams.get('edit')?.toString()) {
            setEditAgentDialog(true)
        }
    }, [searchParams])

    const channelId = pathname.split("/")[pathname.split("/").length - 1]
    const { data, isLoading, error } = useSWR(`/api/agents/${channelId}`, fetcher)
    console.log("DATA: ", data)

    if (error) return <div>falhou em carregar</div>
    if (isLoading) return <Loader_component />
    return (
        <>
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <Tabs defaultValue="agents">
                    <div className="flex justify-between items-center">
                        <TabsList>
                            <TabsTrigger value="agents">Agents</TabsTrigger>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="overview" >
                        {/*<Overview />*/}
                    </TabsContent>
                    <TabsContent value="agents">
                        <div className="">
                            <DeleteAgentialog open={deleteAgentDialog} openChange={onDialogClose} />
                            <EditAgentDialog open={editAgentialog} openChange={onDialogClose} /> 
                            <ListItemTable agents={data.agents} />
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
    agents_id: z.string().min(1, {
        message: 'Please type in a valid agent id'
    }),
})

const editFormSchema = z.object({
    agentName: z.string().min(1, {
        message: 'Please type in a valid password'
    }),
    agentId: z.string().min(1, {
        message: 'Please type in a valid agent id'
    }),
    description: z.string().min(1, {
        message: 'Please type in a valid team id'
    }),
})

export function EditAgentDialog({ open, openChange }) {

    const searchParams = useSearchParams()
    const { toast } = useToast()

    const initialState = {
        errors: {
            agentName: undefined,
            agentId: undefined,
            description: undefined,
        },
        message: undefined
    }

    const initialValues: { agentName: string, agentId: string, description: string } = {
        agentName: searchParams.get('team_name')?.toString(),
        agentId: searchParams.get('edit')?.toString(),
        description: searchParams.get('description')?.toString()
    }

    const form = useForm<z.infer<typeof editFormSchema>>({
        resolver: zodResolver(editFormSchema),
        defaultValues: initialValues
    })

    const [state, formAction] = useFormState(editAgent, initialState)

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
                    <DialogTitle>Edit Agent</DialogTitle>
                    <DialogDescription>
                        Modify the data and save your changes
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form action={formAction}>
                        <FormField
                            control={form.control}
                            name="agentName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input defaultValue={searchParams.get('agent_name')?.toString()} autoFocus {...field} />
                                    </FormControl>
                                    <FormMessage>{state?.errors?.agentName}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="agentId"
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
                                Edit Agent
                            </SubmitBtn>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export function DeleteAgentialog({ open, openChange }) {

    const searchParams = useSearchParams()
    const [tasks_id, setTasks_id] = useState(searchParams.get('delete')?.toString())

    const initialState = {
        errors: {
            password: undefined,
            agents_id: undefined
        },
        message: undefined
    };

    const initialValues: { password: string, agents_id: string } = {
        password: "",
        agents_id: searchParams.get('delete')?.toString()
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues
    })

    const [state, formAction] = useFormState(deleteAgents, initialState);
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
                        {searchParams.get('agent_name')?.toString()}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This agent and its tasks will no longer be
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
                            name="agents_id"
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