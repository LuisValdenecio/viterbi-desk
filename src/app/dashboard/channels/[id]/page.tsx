'use client'

import Loader_component from '@/components/loader'
import SubmitBtn from '@/components/submit-button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { deleteAgents, editAgent } from '@/server-actions/agents'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MoveDown, MoveRight, MoveUp } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'
import { ListItemTable } from '../(components)/agent-list-with-select/tableOfItems'
//import { CreateAgentDialog } from "../(components)/createAgentDialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { postTask } from '@/server-actions/tasks'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export function fetchChannelData(url) {
  const { data, error, isLoading } = useSWR(url, fetcher)

  return {
    channel: data,
    isLoadingFromChannelFetch: isLoading,
    isErrorFromChannelFetch: error,
  }
}

export default function Page() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const [editAgentialog, setEditAgentDialog] = useState(false)
  const [deleteAgentDialog, setDeleteAgentDialog] = useState(false)
  const [createTaskDialog, setCreateTaskDialog] = useState(false)

  const params = new URLSearchParams(searchParams)

  const onDialogClose = () => {
    setDeleteAgentDialog(false)
    setEditAgentDialog(false)
    setCreateTaskDialog(false)
    params.delete('delete')
    params.delete('agent_name')
    params.delete('edit')
    params.delete('create')
    params.delete('description')

    replace(`${pathname}?${params.toString()}`)
  }

  React.useEffect(() => {
    if (searchParams.get('delete')?.toString()) {
      setDeleteAgentDialog(true)
    } else if (searchParams.get('edit')?.toString()) {
      setEditAgentDialog(true)
    } else if (searchParams.get('create')?.toString()) {
        setCreateTaskDialog(true)
    }
  }, [searchParams])

  const channelId = pathname.split('/')[pathname.split('/').length - 1]
  const { data, isLoading, error } = useSWR(`/api/agents/${channelId}`, fetcher)
  console.log('DATA: ', data)

  if (error) return <div>falhou em carregar</div>
  if (isLoading) return <Loader_component />
  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Tabs defaultValue="agents">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview">{/*<Overview />*/}</TabsContent>
          <TabsContent value="agents">
            <div className="">
              <DeleteAgentialog open={deleteAgentDialog} openChange={onDialogClose} />
              <EditAgentDialog open={editAgentialog} openChange={onDialogClose} />
              <CreateTaskDialog open={createTaskDialog} openChange={onDialogClose} />
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
    message: 'Please type in a valid password',
  }),
  agents_id: z.string().min(1, {
    message: 'Please type in a valid agent id',
  }),
})

const editFormSchema = z.object({
  agentName: z.string().min(1, {
    message: 'Please type in a valid password',
  }),
  agentId: z.string().min(1, {
    message: 'Please type in a valid agent id',
  }),
  description: z.string().min(1, {
    message: 'Please type in a valid team id',
  }),
})

const createTaskformSchema = z.object({
  taskName: z.string().min(1, {
    message: 'Please enter a valid name for the Agent.',
  }),
  priority: z.string().min(1, {
    message: 'Please select a valid action.',
  }),
  agentId: z.string().min(1, {
    message: 'Add a valid channel id',
  }),
  action: z.string().min(1, {
    message: 'Please select a valid action.',
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
    message: undefined,
  }

  const initialValues: { agentName: string; agentId: string; description: string } = {
    agentName: searchParams.get('team_name')?.toString(),
    agentId: searchParams.get('edit')?.toString(),
    description: searchParams.get('description')?.toString(),
  }

  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: initialValues,
  })

  const [state, formAction] = useFormState(editAgent, initialState)

  React.useEffect(() => {
    if (state.message == 'Success') {
      openChange()
      toast({
        title: 'Team removed',
        description: `The task was delted successfully`,
        action: <ToastAction altText="Refresh">Undo</ToastAction>,
      })
    }

    if (Array.isArray(state?.errors)) {
      state.errors.forEach((error) => {
        form.setError(error.field, { message: error.message })
      })
    } else if (state?.message === 'access denied') {
      openChange()
      toast({
        title: 'Operation blocked',
        description: `You don't have the privileges to complete this.`,
      })
    }
  }, [state?.errors])

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>Modify the data and save your changes</DialogDescription>
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
              <SubmitBtn>Edit Agent</SubmitBtn>
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
      agents_id: undefined,
    },
    message: undefined,
  }

  const initialValues: { password: string; agents_id: string } = {
    password: '',
    agents_id: searchParams.get('delete')?.toString(),
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  const [state, formAction] = useFormState(deleteAgents, initialState)
  const [incorrectPassword, setIncorrectPassword] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    setTasks_id(searchParams.get('delete')?.toString())
    setIncorrectPassword(false)
    if (state.message == 'Success') {
      openChange()
      toast({
        title: 'Task removed',
        description: `The task was delted successfully`,
        action: <ToastAction altText="Refresh">Undo</ToastAction>,
      })
    }

    if (Array.isArray(state?.errors)) {
      state.errors.forEach((error) => {
        form.setError(error.field, { message: error.message })
      })
    } else {
      if (state.message === 'incorrect password') {
        setIncorrectPassword(true)
      } else if (state?.message === 'access denied') {
        openChange()
        toast({
          title: 'Operation blocked',
          description: `You don't have the privileges to complete this.`,
        })
      }
    }
  }, [state?.errors, searchParams])

  return (
    <AlertDialog open={open} onOpenChange={openChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{searchParams.get('agent_name')?.toString()}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This agent and its tasks will no longer be accessible by you or others
            you&apos;ve shared it with.
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
                  {incorrectPassword && <FormMessage>Incorrect password</FormMessage>}
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
                  {incorrectPassword && <FormMessage>Incorrect password</FormMessage>}
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
  const { pending } = useFormStatus()
  return (
    <Button variant="destructive" type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
    </Button>
  )
}

export function CreateTaskDialog({ open, openChange }) {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const initialState = {
    errors: {
      taskName: undefined,
      agentId: undefined,
      action: undefined,
    },
    message: undefined,
  }

  const initialValues: { taskName: string; agentId: string; action: string } = {
    taskName: '',
    agentId: searchParams.get('create')?.toString(),
    action: '',
  }

  const form = useForm<z.infer<typeof createTaskformSchema>>({
    resolver: zodResolver(createTaskformSchema),
    defaultValues: initialValues,
  })

  const [state, formAction] = useFormState(postTask, initialState)

  useEffect(() => {
    console.log('FORM STATE: ', state)
    if (state?.message) {
      if (state?.message === 'Success') {
        openChange()
        toast({
          title: 'Task created',
          description: `${state?.taskName} created successfully`,
          action: <ToastAction altText="Refresh">Undo</ToastAction>,
        })

        router.push(`/dashboard/tasks/${state?.taskId}`)
      }
    }

    if (Array.isArray(state?.errors)) {
      state.errors.forEach((error) => {
        form.setError(error.field, { message: error.message })
      })
    } else if (state?.message === 'access denied') {
      openChange()
      toast({
        title: 'Operation blocked',
        description: `You don't have the privileges to complete this.`,
      })
    } else if (state?.message === 'quota limit reached') {
      openChange()
      toast({
        title: 'Task quota limit reaced',
        description: `Ask for more credit`,
      })
    }
  }, [state?.errors])

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Task</DialogTitle>
          <DialogDescription>Agents can do things on your behalf on your channels.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction}>
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="type in the name of the Task" {...field} />
                  </FormControl>
                  <FormMessage>{state?.errors?.taskName}</FormMessage>
                </FormItem>
              )}
            />

            <div className="mb-4 grid gap-3">
              <Label htmlFor="model">Tasks Priority</Label>
              <Select name="priority">
                <SelectTrigger id="model" className="items-start [&_[data-description]]:hidden">
                  <SelectValue placeholder="Select a priority for this task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <MoveDown className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">Low</span>
                        </p>
                        <p className="text-xs" data-description>
                          Reads all the data and makes reports
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <MoveRight className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">Medium</span>
                        </p>
                        <p className="text-xs" data-description>
                          Tasks run once stack is free
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <MoveUp className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">High</span>
                        </p>
                        <p className="text-xs" data-description>
                          The tasks run ASAP
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
                <FormMessage>{state?.errors?.priority}</FormMessage>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="agentId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Channel id</FormLabel>
                  <FormControl>
                    <Input defaultValue={searchParams.get('create')?.toString()} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <fieldset className="mb-4 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">Execution Schedule</legend>

              <div className="mb-2 text-orange-500">
                <span className="text-sm">You can add advanced schedule later</span>
              </div>

              <div className="mb-4 grid gap-3">
                <Select name="timezone">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>North America</SelectLabel>
                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                      <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                      <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Europe & Africa</SelectLabel>
                      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="cet">Central European Time (CET)</SelectItem>
                      <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                      <SelectItem value="west">Western European Summer Time (WEST)</SelectItem>
                      <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                      <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Asia</SelectLabel>
                      <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                      <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                      <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                      <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                      <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                      <SelectItem value="ist_indonesia">Indonesia Central Standard Time (WITA)</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Australia & Pacific</SelectLabel>
                      <SelectItem value="awst">Australian Western Standard Time (AWST)</SelectItem>
                      <SelectItem value="acst">Australian Central Standard Time (ACST)</SelectItem>
                      <SelectItem value="aest">Australian Eastern Standard Time (AEST)</SelectItem>
                      <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                      <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>South America</SelectLabel>
                      <SelectItem value="art">Argentina Time (ART)</SelectItem>
                      <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                      <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                      <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage>{state?.errors?.timezone}</FormMessage>
              </div>

              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-3">
                  <Select name="day">
                    <SelectTrigger className="">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Weekdays</SelectLabel>
                        <SelectItem value="monday">monday</SelectItem>
                        <SelectItem value="tuesday">tuesday</SelectItem>
                        <SelectItem value="wednesday">wednesday</SelectItem>
                        <SelectItem value="thursday">thursday</SelectItem>
                        <SelectItem value="friday">friday</SelectItem>
                        <SelectItem value="saturday">saturday</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Select name="day_period">
                    <SelectTrigger className="">
                      <SelectValue placeholder="AM-PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="grid w-full items-center gap-1.5">
                      <Input type="time" name="hour_minute" id="time" aria-label="Choose time" className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
              {(state?.errors?.day || state?.errors?.day_period || state?.errors?.hour_minute) && (
                <FormMessage className="mt-2">Please select a valid time point</FormMessage>
              )}
            </fieldset>

            <SubmitBtn>Create Task</SubmitBtn>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
