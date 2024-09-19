'use client'

import * as React from "react"

import { useFormStatus } from "react-dom";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ListItemTable } from '../(components)/task-list/tableOfItems'
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import useSWR from 'swr'
import Loader_component from '@/components/loader'
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

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Page() {

    const pathname = usePathname()
    const { replace } = useRouter()
    const searchParams = useSearchParams()
    const agentId = pathname.split("/")[pathname.split("/").length - 1]
    const { data, isLoading, error } = useSWR(`/api/tasks/${agentId}`, fetcher)
    const [deleteTaskDialog, setDeleteTaskDialog] = useState(false)
    const [editTaskDialog, setEditTaskDialog] = useState(false)

    const params = new URLSearchParams(searchParams);

    useEffect(() => {
      if (searchParams.get('delete')?.toString()) {
        setDeleteTaskDialog(true)
      } else if (searchParams.get('edit')?.toString()) {
        setEditTaskDialog(true)
      }
    }, [searchParams])
  
    const onDialogClose = () => {
      setDeleteTaskDialog(false)
      setEditTaskDialog(false)
      params.delete('delete')
      params.delete('task_name')
      params.delete('edit')
      params.delete('priority')
      params.delete('timezone')
      params.delete('schedule_id')
      params.delete('day')
      params.delete('day_period')
      params.delete('hour_minute')
      replace(`${pathname}?${params.toString()}`);
    }
      
    if (error) return <div>falhou em carregar</div>
    if (isLoading) return <Loader_component />

    return (
        <>
            <DeleteTaskDialog open={deleteTaskDialog} openChange={onDialogClose} />
            <EditTaskDialog open={editTaskDialog} openChange={onDialogClose} />
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

                <Tabs defaultValue="tasks">
                    <div className="flex justify-between items-center">
                        <TabsList>
                            <TabsTrigger value="tasks">Tasks</TabsTrigger>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="tasks">
                        <ListItemTable agents={data.tasks} />
                    </TabsContent>
                    <TabsContent value="overview" >

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
    tasks_ids: z.string().min(1, {
      message: 'Please type in a valid agent id'
    }),
  })
  
  export function DeleteTaskDialog({ open, openChange }) {
  
    const searchParams = useSearchParams()
    const [tasks_id, setTasks_id] = useState(searchParams.get('delete')?.toString())
  
    const initialState = {
      errors: {
        password: undefined,
        tasks_ids: undefined
      },
      message: undefined
    };
  
    const initialValues: { password: string, tasks_ids: string } = {
      password: "",
      tasks_ids: searchParams.get('delete')?.toString()
    }
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: initialValues
    })
  
    const [state, formAction] = useFormState(deleteTaks, initialState);
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
              {searchParams.get('task_name')?.toString()}
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
                name="tasks_ids"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input defaultValue={[tasks_id].join(",")} {...field} />
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
  
  const taskEditformSchema = z.object({
    taskName: z.string().min(1, {
      message: 'Please enter a valid name for the Agent.'
    }),
    priority: z.string().min(1, {
      message: 'Please select a valid action.'
    }),
    task_id: z.string().min(1, {
      message: 'Add a valid channel id'
    }),
    taskSchedule_id: z.string().min(1, {
      message: 'Add a valid schedule id'
    }),
    action: z.string().min(1, {
      message: 'Please select a valid action.'
    }),
  })
  
  export function EditTaskDialog({ open, openChange }) {
  
    const searchParams = useSearchParams()
    const { toast } = useToast()
  
    const initialState = {
      errors: {
        taskName: undefined,
        task_id: undefined,
        taskSchedule_id: undefined,
        action: undefined
      },
      message: undefined
    };
  
    const [state, formAction] = useFormState(editTask, initialState);
  
    React.useEffect(() => {
      if (state?.message) {
        if (state?.message === 'Success') {
          openChange()
          toast({
            title: "Task updated",
            description: `${state?.taskName} updated successfully`,
            action: (
              <ToastAction altText="Refresh">Undo</ToastAction>
            ),
          })
      }}
  
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
    }, [searchParams, state?.errors])
  
    const form = useForm<z.infer<typeof taskEditformSchema>>({
      resolver: zodResolver(taskEditformSchema),
      defaultValues: null
    })
  
    return (
      <Dialog open={open} onOpenChange={openChange}>
  
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Agents can do things on your behalf on your channels.
            </DialogDescription>
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
                      <Input defaultValue={searchParams.get('task_name')?.toString()} placeholder="type in the name of the Task" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.taskName}</FormMessage>
                  </FormItem>
                )}
              />
  
              <div className="grid gap-3 mb-4">
                <Label htmlFor="model">Tasks Priority</Label>
                <Select name="priority" defaultValue={searchParams.get('priority')?.toString()}>
                  <SelectTrigger
                    id="model"
                    className="items-start [&_[data-description]]:hidden"
                  >
                    <SelectValue placeholder="Select a priority for this task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <MoveDown className="size-5" />
                        <div className="grid gap-0.5">
                          <p>
  
                            <span className="font-medium text-foreground">
                              Low
                            </span>
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
                            <span className="font-medium text-foreground">
                              Medium
                            </span>
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
                            <span className="font-medium text-foreground">
                              High
                            </span>
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
                name="task_id"
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
                name="taskSchedule_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Channel id</FormLabel>
                    <FormControl>
                      <Input defaultValue={searchParams.get('schedule_id')?.toString()} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
  
              <fieldset className="rounded-lg border p-4 mb-4 ">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Execution Schedule
                </legend>
  
                <div className="mb-2 text-orange-500">
                  <span className="text-sm">You can add advanced schedule later</span>
                </div>
  
                <div className="grid gap-3 mb-4">
                  <Select name="timezone" defaultValue={searchParams.get('timezone')?.toString()}>
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
                        <SelectItem value="west">
                          Western European Summer Time (WEST)
                        </SelectItem>
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
                        <SelectItem value="ist_indonesia">
                          Indonesia Central Standard Time (WITA)
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Australia & Pacific</SelectLabel>
                        <SelectItem value="awst">
                          Australian Western Standard Time (AWST)
                        </SelectItem>
                        <SelectItem value="acst">
                          Australian Central Standard Time (ACST)
                        </SelectItem>
                        <SelectItem value="aest">
                          Australian Eastern Standard Time (AEST)
                        </SelectItem>
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
  
                    <Select name="day" defaultValue={searchParams.get('day')?.toString()}>
                      <SelectTrigger className="" >
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
  
                    <Select name="day_period" defaultValue={searchParams.get('day_period')?.toString()}>
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
  
                        <Input type="time" defaultValue={searchParams.get('hour_minute')?.toString()} name="hour_minute" id="time" aria-label="Choose time" className="w-full" />
                      </div>
                    </div>
  
                  </div>
  
                </div>
                <div className="mt-2">
                  {(state?.errors?.day || state?.errors?.day_period || state?.errors?.hour_minute) &&
                    (<FormMessage className="mt-2">Please select a valid time point</FormMessage>)
                  }
                </div>
              </fieldset>
  
  
              <SubmitBtn>
                Edit Task
              </SubmitBtn>
            </form>
          </Form>
  
        </DialogContent>
      </Dialog>
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