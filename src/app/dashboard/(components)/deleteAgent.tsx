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
import { deleteAgent } from '@/server-actions/agents'
import { usePathname } from 'next/navigation'
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

//@ts-ignore
import { useFormStatus } from "react-dom";
import { useFormState } from 'react-dom'
import { z } from "zod"
import { useEffect, useState } from "react"

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
      {pending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Delete Agent'}
    </Button>
  )
}

const formSchema = z.object({
  agentName: z.string().min(1, {
    message: 'Please type the name of the agent'
  }),
  agentId: z.string().min(1, {
    message: 'Please enter a valid id for the Agent.'
  }),
})

export function DeleteAgentDialog({ agentId, agentName }) {

  const initialState = {
    errors: {
      agentName: undefined,
      agentId : undefined
    },
    message: undefined
  };

  const initialValues: { agentName: string, agentId : string } = {
    agentName: "",
    agentId : agentId
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(deleteAgent, initialState);
  const [nameDontMatchError, setNameDontMatchError ] = useState(false)

  useEffect(() => {

    setNameDontMatchError(false)
    if (state?.message === 'The name does not match') {
      setNameDontMatchError(true)
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
          <Button variant="ghost" className="text-left">
            Remove
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Write the name of the agent to remove it. <b>{agentName}</b>
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
                    {nameDontMatchError && (<FormMessage>{state?.message}</FormMessage>)}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agentId"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Agent Id</FormLabel>
                    <FormControl>
                      <Input defaultValue={agentId} {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.agentId}</FormMessage>
                  </FormItem>
                )}
              />
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
          Remove
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Delete Agent</DrawerTitle>
          <DrawerDescription>
            Write the name of the agent to remove it. <b>{agentName}</b>
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
            <form action={formAction} className="px-4">

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
                name="agentId"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input defaultValue={agentId} {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.agentId}</FormMessage>
                  </FormItem>
                )}
              />


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
