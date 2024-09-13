"use client"

import * as React from "react"
import useSWR from 'swr'

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { labels } from "../data/data"
import { taskSchema } from "../data/schema"
import { Play, SquareArrowUp, SquareArrowUpRight, Trash2 } from "lucide-react"
import Link from "next/link"
import { EditAgentDialog } from "@/app/dashboard/channels/(components)/editAgentDialog"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { useMediaQuery } from "@/hooks/use-media-query"
import  SubmitBtn  from "@/components/submit-button"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { Edit2Icon, Trash2Icon } from "lucide-react"
import { deleteAgents } from "@/server-actions/agents"
import { OperationDeniedAlert } from "@/app/dashboard/(components)/operationDenied"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)
  console.log("ROW INFO", row)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <EditAgentDialog agent_id={row.original?.agent_id}/>
        <DeleteAgentDialog data_to_delete={row.original?.agent_id}/>
        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`/dashboard/agents/${row.original?.agent_id}`}>
             Go to
            <DropdownMenuShortcut>
              <SquareArrowUpRight className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function DeleteAgentDialog({data_to_delete}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { data: permission, isLoading: permissionLoading, error: permissionError } = useSWR(`/api/permissions/agents/${data_to_delete}`, fetcher)

  const toggleDeleteDialog = (toggler : boolean) => {
    setOpen(toggler)
  }
 
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
                  Delete 
                <Trash2Icon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Tasks</DialogTitle>
              <DialogDescription>
                Type in your password to delete
              </DialogDescription>
            </DialogHeader>
            <ProfileForm dataToDelete={data_to_delete} closeParentDialog={() => toggleDeleteDialog(false)} />
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
                  Delete 
                <Trash2Icon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </OperationDeniedAlert>
      )
    }
  }
 
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Type in your password to delete
          </DrawerDescription>
        </DrawerHeader>
        
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
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
 
function ProfileForm({closeParentDialog, dataToDelete}) {

  const initialState = {
    errors : {
      password : undefined,
      agents_id : undefined
    },
    message : undefined
  };

  const agents_id = [dataToDelete]

  console.log("AGENTS IDS: ", agents_id)

  const initialValues : {password : string, agents_id : string} = {
    password: "",
    agents_id : agents_id.join(",")
  }

  const form =  useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(deleteAgents, initialState);
  const [ incorrectPassword, setIncorrectPassword ] = useState(false)
  const { toast } = useToast()


  React.useEffect(() => {
    setIncorrectPassword(false)

    if (state.message == 'Success') {
      closeParentDialog()
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
      }
    }
  }, [state?.errors]);

  return (
    <Form {...form}>
      <form action={formAction} className="grid items-start gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="type in your password" {...field}/>
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
                <Input defaultValue={agents_id.join(",")} {...field}/>
              </FormControl>
            </FormItem>
          )}
        />
        <SubmitBtn>Remove agents</SubmitBtn>
      </form>
    </Form>
  )
}