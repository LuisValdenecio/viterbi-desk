"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

//import { labels, priorities, statuses } from "../data/data"
import { statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Gmail, Discord } from '@/components/svg-icons'

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
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[180px] truncate">{row.getValue("name")}</div>,
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
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("description")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "agents",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Agents" />
    ),
    cell: ({ row }) => {
      //const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/*{label && <Badge variant="outline">{label.label}</Badge>}*/}
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("agents").length}
          </span>
        </div>
      )
    },
  },
  
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
