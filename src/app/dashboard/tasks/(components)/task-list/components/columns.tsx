"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { labels, priorities, statuses } from "../data/data"
import { Task } from "../data/schema"
import { useFormStatus } from "react-dom";
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { PlusCircle, Loader2, Eye, PencilRuler, Zap, ClockIcon, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { executeTask } from "@/server-actions/tasks"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { CheckCircledIcon } from "@radix-ui/react-icons"
import { Gauge } from "@/app/dashboard/(components)/circleGraph"

export function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit"
          variant="outline"
          size="sm"
          className="hidden h-8 lg:flex"
          disabled={pending}
        >
          
          {pending ? 
          (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Run
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <Play className="mr-2 h-3 w-3" /> Run
            </div>
          )}
        </Button>
  )
}

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task Name" />
    ),
    cell: ({ row }) => <div className="w-[250px] flex items-center gap-2 truncate">
      
        <Avatar className="size-6">
          <AvatarFallback>{row.getValue("name").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="truncate">{row.getValue("name")}</span>
    </div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const status = priorities.find(
        (status) => status.value === row.getValue("priority")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[90px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
 
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "execute",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Execute Task" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center w-[80px]">
          <form action={executeTask}>
            <input type="text" name="task-id" className="hidden" value={row?.original?.task_id} />
            <SubmitBtn/>
          </form>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completion Rate" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex gap-1 w-[60px] items-center">
         <Gauge value={Math.floor(Math.random() * 101)} size="small" showValue={false} />
         <span>{Math.floor(Math.random() * 101)}%</span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  
  
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
