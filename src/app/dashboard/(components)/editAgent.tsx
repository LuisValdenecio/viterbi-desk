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
import { PlusCircle, Loader2, Eye, PencilRuler, Zap } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { updateAgent } from '@/server-actions/agents'
import { usePathname } from 'next/navigation'
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

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
  agentName: z.string().min(1, {
    message: 'Please enter a valid name for the Agent.'
  }),
  agentId: z.string().min(1, {
    message: 'Add a valid channel id'
  }),
  action: z.string().min(1, {
    message: 'Please select a valid action.'
  }),
})

export function EditAgentDialog({ agentId, agentName, agentAction }) {

  const initialState = {
    errors: {
      agentName: undefined,
      agentId: undefined,
      action: undefined
    },
    message: undefined
  };

  const initialValues: { agentName: string, agentId: string, action: string } = {
    agentName: agentName,
    agentId: agentId,
    action: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(updateAgent, initialState);

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
          <Button variant="ghost" className=" text-left">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Fill in the fields to edit <b>{agentName}</b>
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form action={formAction}>

              <FormField
                control={form.control}
                name="agentName"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input defaultValue={agentName} placeholder="type in the name of the Agent" {...field} />
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
                      <Input defaultValue={agentId} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid gap-3 mb-4">
                <Label htmlFor="model">Actions</Label>
                <Select name="action" defaultValue={agentAction}>
                  <SelectTrigger
                    id="model"
                    name="action"
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
                    <SelectItem value="Read/Write">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Zap className="size-5" />
                        <div className="grid gap-0.5">
                          <p>
                            <span className="font-medium text-foreground">
                              Read/Write
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
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-full text-left">
          Edit
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Agent</DrawerTitle>
          <DrawerDescription>
            Fill in the fields to edit <b>{agentName}</b>
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form action={formAction} className="px-4">

            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input defaultValue={agentName} placeholder="type in the name of the Agent" {...field} />
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
                    <Input defaultValue={agentId} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid gap-3">
              <Label htmlFor="model">Actions</Label>
              <Select name="action" defaultValue={agentAction}>
                <SelectTrigger
                  id="model"
                  name="action"
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
                  <SelectItem value="Read/Write">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <Zap className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">
                            Read/Write
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
