'use client'

import * as React from "react"
import useSWR from 'swr'

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import  SubmitBtn  from "@/components/submit-button"
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
import Link from "next/link"
import { PlusCircle, Loader2, Eye, PencilRuler, Zap, ClockIcon, MoveDown, MoveRight, MoveUp, Edit2Icon, Trash2Icon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,

} from "@/components/ui/select"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { postAgent } from '@/server-actions/agents'
import { usePathname, useRouter } from 'next/navigation'
import { editTask, getTask, postTask } from '@/server-actions/tasks'
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

//@ts-ignore
import { useFormState } from 'react-dom'
import { z } from "zod"
import { useEffect } from "react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { OperationDeniedAlert } from "../../(components)/operationDenied"

const formSchema = z.object({
  taskName: z.string().min(1, {
    message: 'Please enter a valid name for the Agent.'
  }),
  priority: z.string().min(1, {
    message: 'Please select a valid action.'
  }),
  task_id: z.string().min(1, {
    message: 'Add a valid channel id'
  }),
  taskSchedule_id : z.string().min(1, {
    message: 'Add a valid schedule id'
  }),
  action: z.string().min(1, {
    message: 'Please select a valid action.'
  }),
})

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function EditTaskDialog({taskId}) {

  let task_to_edit: any = null;
  const task_id = taskId;
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { data: permission, isLoading: permissionLoading, error: permissionError } = useSWR(`/api/permissions/task/${taskId}`, fetcher)

  const initialState = {
    errors: {
      taskName: undefined,
      task_id: undefined,
      taskSchedule_id : undefined,
      action: undefined
    },
    message: undefined
  };

  const [state, formAction] = useFormState(editTask, initialState);
  const [taskData, setTaskData] = React.useState("")

  useEffect(() => {

    const fetchData = async () => {
      task_to_edit = await getTask(taskId)
      setTaskData(task_to_edit)
      console.log("TASK TO EDIT: ", task_to_edit)
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });

    if (state?.message) {
      if (state?.message === 'Success') {
        setOpen(false)
        toast({
          title: "Task updated",
          description: `${state?.taskName} created successfully`,
          action: (
            <ToastAction altText="Refresh">Undo</ToastAction>
          ),
        })
      }
    }

    if (Array.isArray(state?.errors)) {
      state.errors.forEach((error) => {
        form.setError(error.field, { message: error.message });
      })
    }
  }, [state?.errors]);

  const initialValues: { taskName: string, task_id: string, action: string } = {
    taskName: taskData?.name,
    task_id: taskId,
    action: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (permissionError) return <div>falhou em carregar</div>
  if (permissionLoading) return <div>carregando...</div>
  if (isDesktop) {

    if (permission === 'owner') {
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
              <DialogTitle>Create a New Task</DialogTitle>
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
                        <Input defaultValue={taskData?.name} placeholder="type in the name of the Task" {...field} />
                      </FormControl>
                      <FormMessage>{state?.errors?.taskName}</FormMessage>
                    </FormItem>
                  )}
                />
  
                <div className="grid gap-3 mb-4">
                <Label htmlFor="model">Tasks Priority</Label>
                  <Select name="priority" defaultValue={taskData?.priority}>
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
                        <Input defaultValue={taskId} {...field} />
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
                        <Input defaultValue={taskData?.taskScheduleId} {...field} />
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
                    <Select name="timezone" defaultValue={taskData?.timezone}>
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
  
                      <Select name="day" defaultValue={taskData?.day}>
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
  
                      <Select name="day_period" defaultValue={taskData?.dayPeriod}>
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
  
                          <Input type="time" defaultValue={taskData?.hourAndMinute}  name="hour_minute" id="time" aria-label="Choose time" className="w-full" />
                        </div>
                      </div>
  
                    </div>
  
                  </div>
                  {(state?.errors?.day || state?.errors?.day_period || state?.errors?.hour_minute) && 
                    (<FormMessage className="mt-2">Please select a valid time point</FormMessage>)
                  }
                 
                </fieldset>
  
               
                <SubmitBtn>
                  Edit Task
                </SubmitBtn>
              </form>
            </Form>
  
          </DialogContent>
        </Dialog>
      )
    } else {
      return (
        <OperationDeniedAlert>
          <Button
              variant="outline"
              size="sm"
              className="font-normal h-8 lg:flex w-full flex justify-between border-none"
            >
                Edit 
              <Edit2Icon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </OperationDeniedAlert>
      )
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Action
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

            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="type in the task name" {...field} />
                  </FormControl>
                  <FormMessage>{state?.errors?.taskName}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="task_id"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Channel id</FormLabel>
                  <FormControl>
                    <Input value="66ba56e122792ceeb8f8cdc8" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid gap-3">
              <Label htmlFor="model">Templates</Label>
              <Select name="template">
                <SelectTrigger
                  id="model"
                  className="items-start [&_[data-description]]:hidden"
                >
                  <SelectValue placeholder="Select what your agent can do" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Read">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <Eye className="size-5" />
                      <div className="grid gap-0.5">
                        <p>

                          <span className="font-medium text-foreground">
                            Read
                          </span>
                        </p>
                        <p className="text-xs" data-description>
                          Reads all the data and makes reports
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Write">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <PencilRuler className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">
                            Write
                          </span>
                        </p>
                        <p className="text-xs" data-description>
                          Can act on the channel, like sending messages
                        </p>
                      </div>
                    </div>
                  </SelectItem>

                  <SelectItem value="Execute">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <Zap className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">
                            Execute
                          </span>
                        </p>
                        <p className="text-xs" data-description>
                          The most powerful model for complex
                          computations.
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
                <FormMessage>{state?.errors?.action}</FormMessage>
              </Select>
            </div>
            <SubmitBtn>Edit Task</SubmitBtn>
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
