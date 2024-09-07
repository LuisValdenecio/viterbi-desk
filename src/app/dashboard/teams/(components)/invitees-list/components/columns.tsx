"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { labels, priorities, statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { CheckCircledIcon } from "@radix-ui/react-icons"

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
    accessorKey: "guest_email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-mail" />
    ),
    cell: ({ row }) => <div className="w-[150px] flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback>{row.getValue("guest_email").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="truncate">{row.getValue("guest_email")}</span>
    </div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "inviter_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invited by" />
    ),
    cell: ({ row }) => {
      //const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/*label && <Badge variant="outline">{label.label}</Badge>*/}
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("inviter_name")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "inviter_email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inviter E-mail" />
    ),
    cell: ({ row }) => <div className="w-[150px] flex items-center gap-2">
        <Avatar className="size-6">
          
          <AvatarFallback>{row.getValue("inviter_email").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="truncate">{row.getValue("inviter_email")}</span>
    </div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.original["guest_role"]
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
      return value.includes(row.original["guest_role"])
    },
  },
  /*
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      )

      if (!priority) {
        return null
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  */
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
