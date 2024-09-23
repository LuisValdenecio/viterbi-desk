"use client"

import { DotsHorizontalIcon, LightningBoltIcon, QuestionMarkIcon } from "@radix-ui/react-icons"
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
import { BellElectricIcon, BlocksIcon, DollarSignIcon, FlashlightIcon, ListCheckIcon, Sparkles, StopCircle, Trash2 } from "lucide-react"
import Link from "next/link"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  //const task = taskSchema.parse(row.original)
  console.log("MEMBER INFO: ", row)
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
        <Link className="flex cursor-pointer" href={`/dashboard/members/${row.original?.user_id}?name=${row.original?.name}&img=${row.original?.img}&email=${row.original?.email}`}>
          Open
        </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`?member=${row.original?.user_id}&name=${row.original?.name}&role=${row.original?.role}`}>
              Playground 
            <DropdownMenuShortcut>
              <Sparkles className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`?member=${row.original?.user_id}&name=${row.original?.name}&role=${row.original?.role}`}>
              Requests 
            <DropdownMenuShortcut>
              <QuestionMarkIcon className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`?member=${row.original?.user_id}&name=${row.original?.name}&role=${row.original?.role}`}>
              Tasks 
            <DropdownMenuShortcut>
              <LightningBoltIcon className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
