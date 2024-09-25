"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { active_statuses, labels, priorities, statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Gauge } from "@/app/dashboard/(components)/circleGraph"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => 
    <div className="w-[100px] flex items-center gap-2">
      <Avatar className="size-6">   
        <AvatarImage src={row.original.img ? `https://ucarecdn.com/${row.original.img}/-/crop/face/1:1/` : ''} alt="@shadcn" /> 
        <AvatarFallback>{row.getValue("name").charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="truncate">{row.getValue("name")}</span>
    </div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="w-[120px] truncate">{row.getValue("email")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "team",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team" />
    ),
    cell: ({ row }) => 
    <div className="w-[200px] truncate">
      <span className="font-medium">
        {row.getValue("team")}
      </span>
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
        (status) => status.value === row.original["role"]
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[80px] items-center">
          {status.icon && (
            <status.icon className="mr-1 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      console.log("ROW: ", row, id, value)
      return value.includes(row.original["role"])
    },
  },
  {
    accessorKey: "active_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = active_statuses.find(
        (status) => status.value === row.original["status"]
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[90px] items-center">
          {status.icon && (
            <status.icon className="mr-1 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      console.log("ROW: ", row, id, value)
      return value.includes(row.original["status"])
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task Quota" />
    ),
    cell: ({ row }) => {
      
      if (row?.original?.task_quota > 0) {
        return (
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex gap-1 w-[60px] items-center">
                    <Gauge value={Math.floor((row?.original?.used_task_quota/row?.original?.task_quota) * 100)} size="small" showValue={false} />
                    <span>{Math.floor((row?.original?.used_task_quota/row?.original?.task_quota) * 100)}%</span>
                  </div> 
                </TooltipTrigger>
                <TooltipContent>
                <p>
                    {row?.original?.used_task_quota +"/"+ row?.original?.task_quota}
                </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        )
      } else {
        return (
          <div className="flex w-[90px] items-center">
              <ExclamationTriangleIcon color="orange" className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>No quota</span>
          </div>
        )
      }

    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
