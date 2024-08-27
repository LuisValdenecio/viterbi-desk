'use client'

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
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
import { PlusCircle, Loader2, Eye, PencilRuler, Zap, ClockIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,

} from "@/components/ui/select"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { postAgent } from '@/server-actions/agents'
import { usePathname } from 'next/navigation'
import { postTask } from '@/server-actions/tasks'

//@ts-ignore
import { useFormStatus } from "react-dom";
import { useFormState } from 'react-dom'
import { z } from "zod"
import { useEffect } from "react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Create Agent'}
    </Button>
  )
}

const formSchema = z.object({
  taskName: z.string().min(1, {
    message: 'Please enter a valid name for the Agent.'
  }),
  agentId: z.string().min(1, {
    message: 'Add a valid channel id'
  }),
  action: z.string().min(1, {
    message: 'Please select a valid action.'
  }),
})

export function CreateTaskDialog() {

  const path = usePathname()
  const agentId = path.split("/")[path.split("/").length - 1]

  const initialState = {
    errors: {
      taskName: undefined,
      agentId: undefined,
      action: undefined
    },
    message: undefined
  };

  const initialValues: { taskName: string, agentId: string, action: string } = {
    taskName: "",
    agentId: agentId,
    action: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(postTask, initialState);

  useEffect(() => {

    if (state?.message) {

      /*
      if (state?.message === 'Success') {
        router.push(`/dashboard/agents/${state?.agentID}`)
      }
      */
    }

    if (Array.isArray(state?.errors)) {
      state.errors.forEach((error) => {
        form.setError(error.field, { message: error.message });
      })
    }
  }, [state?.errors]);


  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New
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
                      <Input placeholder="type in the name of the Agent" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.taskName}</FormMessage>
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
                      <Input defaultValue={agentId} {...field} />
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

                    <Select name="day">
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
                {(state?.errors?.day || state?.errors?.day_period || state?.errors?.hour_minute) && 
                  (<FormMessage className="mt-2">Please select a valid time point</FormMessage>)
                }
               
              </fieldset>

              <div className="grid gap-3 mb-4">
                <Label htmlFor="model">Templates</Label>
                <Select name="template">
                  <SelectTrigger
                    id="model"
                    className="items-start [&_[data-description]]:hidden"
                  >
                    <SelectValue placeholder="Select what your agent can do" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inbox Summarizer">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Eye className="size-5" />
                        <div className="grid gap-0.5">
                          <p>

                            <span className="font-medium text-foreground">
                              Inbox Summarizer
                            </span>
                          </p>
                          <p className="text-xs" data-description>
                            Reads all the data and makes reports
                          </p>
                        </div>
                      </div>
                    </SelectItem>



                  </SelectContent>
                  <FormMessage>{state?.errors?.template}</FormMessage>
                </Select>
              </div>
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
              name="agentId"
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
            <SubmitBtn />
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
