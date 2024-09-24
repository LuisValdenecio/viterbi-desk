"use client"

import * as React from "react"
import useSWR from 'swr'

import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

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
import { ArchiveIcon, DeleteIcon, PencilIcon, PlusIcon, Trash2Icon, UserPlus2 } from "lucide-react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { deleteTaks } from "@/server-actions/tasks"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { deleteTeam } from "@/server-actions/channels"


import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui//button"
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
import { EditChannelDialog } from "../../editChannelDialog"
import { OperationDeniedAlert } from "@/app/dashboard/(components)/operationDenied"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

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
        <DropdownMenuItem asChild>
        <Link className="flex cursor-pointer" href={`/dashboard/channels/${row.original?.channel_id}`}>
          Open
        </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`/dashboard/channels?edit=${row.original?.channel_id}&channel_name=${row.original?.name}&description=${row.original?.description}`}>
             Edit
            <DropdownMenuShortcut>
              <PencilIcon className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>           
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`/dashboard/channels?create=${row.original?.channel_id}`}>
             Create Agent
            <DropdownMenuShortcut>
              <UserPlus2 className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>           
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`/dashboard/channels?delete=${row.original?.channel_id}&channel_name=${row.original?.name}`}>
            Delete
            <DropdownMenuShortcut>
              <Trash2 className=" h-4 w-4 text-muted-foreground" color="red"></Trash2>
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
