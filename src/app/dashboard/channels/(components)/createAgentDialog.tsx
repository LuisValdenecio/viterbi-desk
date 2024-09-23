'use client'

import * as React from "react"
import useSWR from 'swr'

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
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { PlusCircle, Loader2, Eye, PencilRuler, Zap, MoveUp, MoveDown, MoveRight, Trash2Icon } from "lucide-react"
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
import { postAgent } from '@/server-actions/agents'
import { usePathname } from 'next/navigation'


//@ts-ignore
import { useFormStatus } from "react-dom";
import { useFormState } from 'react-dom'
import { z } from "zod"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { OperationDeniedAlert } from "../../(components)/operationDenied"

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
  channel: z.string().min(1, {
    message: 'Add a valid channel id'
  }),
  description: z.string().min(1, {
    message: 'Please select a valid action.'
  }),
})

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function CreateAgentDialog() {

  const path = usePathname()
  const channelId = path.split("/")[path.split("/").length - 1]
  const { toast } = useToast()
  
  const initialState = {
    errors: {
      agentName: undefined,
      channel: undefined,
      action: undefined,
      description : undefined
    },
    message: undefined
  };

  const initialValues: { agentName: string, channel: string, description: string } = {
    agentName: "",
    channel: channelId,
    description: ""
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(postAgent, initialState);

  useEffect(() => {

    if (state?.message) {
      if (state?.message === 'Success') {
        setOpen(false)
        toast({
          title: "Agent created successfully",
          description: `${state?.agentID} created successfully`,
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


  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const { data: permission, isLoading: permissionLoading, error: permissionError } = useSWR(`/api/permissions/channel/${channelId}`, fetcher)
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
            className="ml-auto hidden h-8 lg:flex"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Agent
          </Button>
            
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a new agent</DialogTitle>
              <DialogDescription>
                Agents can do things on your behalf on your channels.
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
                        <Input placeholder="type in the name of the Agent" {...field} />
                      </FormControl>
                      <FormMessage>{state?.errors?.agentName}</FormMessage>
                    </FormItem>
                  )}
                />
  
                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormLabel>Channel id</FormLabel>
                      <FormControl>
                        <Input defaultValue={channelId} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
  
                <div className="grid gap-3 mb-4">
                  
                  <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea name="description" placeholder="Type a short description of what you expect this agent to do." />
                      </FormControl>
                      <FormMessage>{state?.errors?.description}</FormMessage>
                    </FormItem>
                  )}
                />
  
                </div>
                <SubmitBtn />
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
            className="ml-auto hidden h-8 lg:flex"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Agent
          </Button>
        </OperationDeniedAlert>
      )
    }
  }
}
