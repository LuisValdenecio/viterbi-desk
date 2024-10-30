"use client"

import * as React from "react"
import { PencilIcon, Trash2, UserPlus2 } from "lucide-react"

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

import { taskSchema } from "../data/schema"
import Link from "next/link"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)
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
        <Link className="flex cursor-pointer" href={`/dashboard/teams/${row.original?.team_id}`}>
          Open
        </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`/dashboard/teams?edit=${row.original?.team_id}&team_name=${row.original?.name}&description=${row.original?.description}`}>
             Edit
            <DropdownMenuShortcut>
              <PencilIcon className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>           
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`/dashboard/teams?member=${row.original?.team_id}`}>
             Add member
            <DropdownMenuShortcut>
              <UserPlus2 className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>           
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`/dashboard/teams?delete=${row.original?.team_id}&team_name=${row.original?.name}`}>
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
