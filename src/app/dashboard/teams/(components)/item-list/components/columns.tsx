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
import { trusted } from "mongoose"
import AvatarsStacked from "@/app/dashboard/(components)/avatarStacked"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team Name" />
    ),
    cell: ({ row }) => <div className="w-[200px] truncate flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback>{row.getValue("name").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="truncate">{row.getValue("name")}</span>
    </div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      //const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/*label && <Badge variant="outline">{label.label}</Badge>*/}
          <span className="max-w-[300px] truncate font-normal">
            {row.getValue("description")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "members",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Members" />
    ),
    cell: ({ row }) => {
      console.log("ROW DATA: ", row.original)
      return (
        <div className="flex space-x-2">
          {/*label && <Badge variant="outline">{label.label}</Badge>*/}
          <span className="max-w-[300px] truncate font-normal">
            <AvatarsStacked members={row?.original?.actual_members} />
            {/*row.getValue('members')*/}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "user_role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Your role" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.original["user_role"]
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
      console.log("ROW: ", row, id, value)
      return value.includes(row.original["user_role"])
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
