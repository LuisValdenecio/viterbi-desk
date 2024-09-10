"use client"

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
import { Edit2Icon, Play, SquareArrowUp, SquareArrowUpRight, Trash2 } from "lucide-react"
import Link from "next/link"
import { EditTaskDialog } from "../../editTaskDialog"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  //const task = taskSchema.parse(row.original)
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
        <EditTaskDialog taskId={row.original?.task_id}/>
        <DropdownMenuItem asChild>
          <Link className="flex cursor-pointer" href={`/dashboard/agents/${row.original?._id}`}>
             Go to
            <DropdownMenuShortcut>
              <SquareArrowUpRight className=" h-4 w-4 text-muted-foreground" />
            </DropdownMenuShortcut>
          </Link>
           
        </DropdownMenuItem>
       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
