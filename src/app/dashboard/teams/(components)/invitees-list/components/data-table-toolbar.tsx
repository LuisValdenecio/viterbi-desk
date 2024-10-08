"use client"

import * as React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import  SubmitBtn  from "@/components/submit-button"
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

import { Trash2Icon } from "lucide-react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { deleteTaks } from "@/server-actions/tasks"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { deleteTeams } from "@/server-actions/teams"
import { deleteInvitations } from "@/server-actions/invitations"
import { AddMemberDialog } from "../../createPersonDialog"
import { AddPeopleDialog } from "../../createPeopleDialog"
import { Upload_csv_dialog } from "@/components/upload-csv-dialog"
import { usePathname } from "next/navigation"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter invitee..."
          value={(table.getColumn("guest_email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("guest_email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Role"
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
          <DeleteInvitationsDialog data_to_delete={table.getFilteredSelectedRowModel().rows} />
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
        <Upload_csv_dialog button_title={"Upload .csv"} route="members" teamId={pathname.split("/")[pathname.split("/").length - 1]} />
        <AddMemberDialog />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}



export function DeleteInvitationsDialog({data_to_delete}) {
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
            <DialogTitle>Delete Invitations</DialogTitle>
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
  invitations_id: z.string().min(1, {
    message: 'Please type in a valid team id'
  }),
})
 
function ProfileForm({closeParentDialog, dataToDelete}) {

  const initialState = {
    errors : {
      password : undefined,
      invitations_id : undefined
    },
    message : undefined
  };

  console.log("DATA TO DELETE: ", dataToDelete)

  //console.log("DATA TO DELETE: ", dataToDelete)
  const invitations = dataToDelete.flatMap(team => team.original.invitation_id)

  const initialValues : {password : string, invitations_id : string} = {
    password: "",
    invitations_id : invitations.join(",")
  }

  const form =  useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(deleteInvitations, initialState);
  const [ incorrectPassword, setIncorrectPassword ] = useState(false)
  const { toast } = useToast()


  React.useEffect(() => {
    setIncorrectPassword(false)
    console.log("STATE : ", state)
    if (state.message == 'Success') {
      closeParentDialog()
      toast({
        title: "Invitations removed",
        description: `The invitation was deleted successfully`,
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
          name="invitations_id"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input defaultValue={invitations.join(",")} {...field}/>
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