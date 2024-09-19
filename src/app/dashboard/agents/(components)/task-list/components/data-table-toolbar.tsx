"use client"
import * as React from "react"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import useSWR from 'swr'

import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "./data-table-view-options"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormStatus } from "react-dom";


import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { deleteTaks } from "@/server-actions/tasks"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { usePathname } from "next/navigation"
import { CreateTaskDialog } from "../../createTaskDialog"
import Loader_component from "@/components/loader"
import { Loader2, Trash2Icon } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const path = usePathname()
  const agentId = path.split("/")[path.split("/").length - 1]
  const [open, openChange] = useState(false)
  
  const { data: permission, isLoading: permissionLoading, error: permissionError } = useSWR(`/api/permissions/agents/${agentId}`, fetcher)
  
  if (permissionError) return <div>falhou em carregar</div>
  if (permissionLoading) return <Loader_component />  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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
          <div>
            <DeleteTasksDialog open={open} openChange={openChange} data_to_delete={table.getFilteredSelectedRowModel().rows} />
            <Button variant="outline" size="sm" className="h-8 border-dashed" onClick={openChange}> 
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete
            </Button>
          </div>
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
        <CreateTaskDialog />
        <DataTableViewOptions table={table} />
      </div>
    </div>
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

export function DeleteTasksDialog({ open, openChange, data_to_delete}) {

  console.log("DATA TO SEND: ", data_to_delete)
  
  const initialState = {
    errors: {
      password: undefined,
      tasks_ids: undefined
    },
    message: undefined
  };

  //const [tasks_id, setTasks_id] = useState(data_to_delete.flatMap(task => task.original.task_id))

  const tasks_id = data_to_delete.flatMap(task => task.original.task_id)
  
  const initialValues : {password : string, tasks_ids : string} = {
    password: "",
    tasks_ids : data_to_delete.flatMap(task => task.original.task_id)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(deleteTaks, initialState);
  const [incorrectPassword, setIncorrectPassword] = React.useState(false)
  const [ accessDenied, setAccessDenied ] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {

    //setTasks_id(data_to_delete.flatMap(task => task.original.task_id))

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
        setAccessDenied(true)
      } 

    }
  }, [state?.errors]);

  return (
    <AlertDialog open={open} onOpenChange={openChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Tasks
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
                  {accessDenied && (<FormMessage>Access denied. Ask the owner to remove this task</FormMessage>)}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tasks_ids"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <input defaultValue={tasks_id.join(",")} {...field} />
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
