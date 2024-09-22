"use client"

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
import { BlocksIcon, StopCircle, Trash2 } from "lucide-react"
import Link from "next/link"

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
        <DropdownMenuItem asChild>
        <Link className="flex cursor-pointer" href={`/dashboard/members/${row.original?.user_id}?name=${row.original?.name}&role=${row.original?.role}&img=${row.original?.img}&email=${row.original?.email}`}>
          Open
        </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`?member=${row.original?.user_id}&name=${row.original?.name}&role=${row.original?.role}`}>
             Re-assign role
            <DropdownMenuShortcut>
              <BlocksIcon className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>
           
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`?suspend=${row.original?.user_id}&name=${row.original?.name}&role=${row.original?.role}`}>
             Suspend
            <DropdownMenuShortcut>
              <StopCircle className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>
           
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
        <Link className="flex cursor-pointer" href={`?delete_member=${row.original?.user_id}&name=${row.original?.name}`
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
