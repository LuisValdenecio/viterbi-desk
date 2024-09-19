"use client"

import * as React from "react"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui//button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { PencilIcon, Trash2 } from "lucide-react"
import Link from "next/link"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
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
        <Link className="flex cursor-pointer" href={`/dashboard/tasks/${row.original?.task_id}`}>
          Open
        </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`/dashboard/tasks?edit=${row.original?.task_id}&task_name=${row.original?.name}&priority=${row.original?.priority}&timezone=${row.original?.task_schedule?.timezone}&schedule_id=${row.original?.task_schedule?.id}&day=${row.original?.task_schedule?.day}&day_period=${row.original?.task_schedule?.dayPeriod}&hour_minute=${row.original?.task_schedule?.hourAndMinute}`}>
             Edit
            <DropdownMenuShortcut>
              <PencilIcon className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>
           
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
        <Link className="flex cursor-pointer" href={`/dashboard/tasks?delete=${row.original?.task_id}&task_name=${row.original?.name}`
            }>
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