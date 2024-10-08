"use client"
import * as React from "react"
import useSWR from 'swr'

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
import { usePathname } from "next/navigation"
import { CreateAgentDialog } from "../../createAgentDialog"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {(table.getFilteredSelectedRowModel().rows.length > 0) && (
          <DeleteTasksDialog data_to_delete={table.getFilteredSelectedRowModel().rows} />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <CreateAgentDialog />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function DeleteTasksDialog({data_to_delete}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const path = usePathname()
  const channel_id = path.split("/")[path.split("/").length - 1]

  const { data: permission, isLoading: permissionLoading, error: permissionError } = useSWR(`/api/permissions/channel/${channel_id}`, fetcher)

  const toggleDeleteDialog = (toggler : boolean) => {
    setOpen(toggler)
  }
 
  if (isDesktop) {

    if (permission === 'owner') {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed"> 
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete
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
         <Button variant="outline" size="sm" className="h-8 border-dashed"> 
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete
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

  console.log("DATA TO DELETE: ", dataToDelete)
  const agents_id = dataToDelete.flatMap(task => task.original.agent_id)

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