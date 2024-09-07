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
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Run
            </div>
          ) : (
            <div className="flex items-center">
              <Play className="mr-2 h-4 w-4" /> Run
            </div>
          )}
        </Button>
  )
}

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => <div className="w-[150px] truncate">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
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
      console.log("ROW", row)
      /*
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      )
      if (!priority) {
        return null
      }
      */
      return (
        <div className="flex items-center">
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
