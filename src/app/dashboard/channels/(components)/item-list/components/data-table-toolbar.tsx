"use client"

import * as React from "react"

import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "./data-table-view-options"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import  SubmitBtn  from "@/components/submit-button"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"


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

import { statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { ArchiveIcon, DeleteIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { deleteTaks } from "@/server-actions/tasks"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { deleteTeam } from "@/server-actions/channels"



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
        {table.getColumn("provider") && (
          <DataTableFacetedFilter
            column={table.getColumn("provider")}
            title="provider"
            options={statuses}
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
      <DataTableViewOptions table={table} />
    </div>
  )
}



export function DeleteTasksDialog({data_to_delete}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const toggleDeleteDialog = (toggler : boolean) => {
    setOpen(toggler)
  }
 
  if (isDesktop) {
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
  channels_ids: z.string().min(1, {
    message: 'Please type in a valid channel id'
  }),
})
 
function ProfileForm({closeParentDialog, dataToDelete}) {

  const initialState = {
    errors : {
      password : undefined,
      channels_ids : undefined
    },
    message : undefined
  };

  //console.log("DATA TO DELETE: ", dataToDelete)
  const channels_ids = dataToDelete.flatMap(channel => channel.original.channel_id)

  const initialValues : {password : string, channels_ids : string} = {
    password: "",
    channels_ids : channels_ids.join(",")
  }

  const form =  useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(deleteTeam, initialState);
  const [ incorrectPassword, setIncorrectPassword ] = useState(false)
  const { toast } = useToast()


  React.useEffect(() => {
    setIncorrectPassword(false)
    console.log("STATE: ", state)
    if (state.message == 'Success') {
      closeParentDialog()
      toast({
        title: "Channel removed",
        description: `The channel was delted successfully`,
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
          name="channels_ids"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input defaultValue={channels_ids.join(",")} {...field}/>
              </FormControl>
              <FormMessage>{state?.errors?.password}</FormMessage>
              {incorrectPassword && (<FormMessage>Incorrect password</FormMessage>)}
            </FormItem>
          )}
        />
        <SubmitBtn>Remove tasks</SubmitBtn>
      </form>
    </Form>
  )
}