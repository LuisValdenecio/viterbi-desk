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
import { DollarSignIcon, VerifiedIcon } from "lucide-react"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => 
    <div className="w-[150px] flex items-center gap-2">
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
    accessorKey: "playground",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Playground Quota" />
    ),
    cell: ({ row }) => <div className="flex gap-1 w-[60px] items-center">
       <Gauge value={Math.floor(Math.random() * 101)} size="small" showValue={false} />
       <span>500/120</span>
    </div>,
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: "tasks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tasks Quota" />
    ),
    cell: ({ row }) => <div className="flex gap-1 w-[90px] items-center">
       <Gauge value={Math.floor(Math.random() * 101)} size="small" showValue={false} />
       <span>500/120</span>
    </div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "totals",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Totals" />
    ),
    cell: ({ row }) => <div className="w-[90px]">
       <span>4500</span>
    </div>,
    enableSorting: true,
    enableHiding: true,
  },
  
  {
    accessorKey: "requests",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requests" />
    ),
    cell: ({ row }) => <div className="flex cursor-pointer gap-1 w-[120px] items-center">
      <VerifiedIcon color="green" className=" h-4 w-4 text-muted-foreground" />
      <span>No requests</span>
    </div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
