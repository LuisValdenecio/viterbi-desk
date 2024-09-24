"use client"

import { ColumnDef } from "@tanstack/react-table"

//import { labels, priorities, statuses } from "../data/data"
import { statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Gmail, Discord } from '@/components/svg-icons'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[180px] flex items-center gap-2 truncate">
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
          {/*{label && <Badge variant="outline">{label.label}</Badge>}*/}
          <Badge variant="outline">Admin Access</Badge>
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("description")}
          </span>
        </div>
      )
    },
  },
  /*
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => <div className="w-[180px] flex items-center gap-2 truncate">
        <Avatar className="size-6">
          <AvatarFallback>{row.getValue("name").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="truncate">{row.getValue("name")}</span>
    </div>,
    enableSorting: true,
    enableHiding: true,
  },
  */
  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="providers" />
    ),
    cell: ({ row }) => {
      const provider = row.getValue("provider")
      const status = statuses.find(
        (status) => status.value === row.getValue("provider")
      )

      if (!status) {
        return null
      }

      switch(status.label) {
        case 'Gmail' :
          return (
            <div className="flex w-[100px] items-center">
              {status.icon &&  (
                <Gmail  />
              )}
            <span>{status.label}</span>
            </div>
          )
        case 'Discord' :
          return (
            <div className="flex w-[100px] items-center">
              {status.icon &&  (
                <Discord />
              )}
            <span>{status.label}</span>
            </div>
          )
        default : 
          <div className="flex w-[100px] items-center">
            {status.icon &&  (
              <Discord  />
            )}
            <span>{status.label}</span>
          </div>
      }
    },
    enableSorting: false,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  /*
  {
    accessorKey: "agents",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Agents" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          
          <span className="max-w-[200px] truncate font-normal">
            {row.getValue("agents").length}
          </span>
        </div>
      )
    },
  },
  */
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
