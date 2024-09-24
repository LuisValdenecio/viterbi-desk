"use client"

import { DotsHorizontalIcon, LightningBoltIcon } from "@radix-ui/react-icons"
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
import { LightbulbIcon, PencilIcon, Play, SquareArrowUp, SquareArrowUpRight, Trash2 } from "lucide-react"
import Link from "next/link"
import { EditAgentDialog } from "@/app/dashboard/channels/(components)/editAgentDialog"
import { LightBulbIcon } from "@heroicons/react/20/solid"

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
          <Link className="flex cursor-pointer" href={`/dashboard/agents/${row.original?.agent_id}`}>
            Open
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`?edit=${row.original?.agent_id}&agent_name=${row.original?.name}&description=${row.original?.description}`}>
            Edit
            <DropdownMenuShortcut>
              <PencilIcon className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`?create=${row.original?.agent_id}`}>
            Create Task
            <DropdownMenuShortcut>
              <LightningBoltIcon className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`?delete=${row.original?.agent_id}&agent_name=${row.original?.name}`}>
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
