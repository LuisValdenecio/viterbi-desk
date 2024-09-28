"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { active_statuses, priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AddMemberDialog } from "../../createPersonDialog"
import { AddPeopleDialog } from "../../createPeopleDialog"
import { Upload_csv_dialog } from "@/components/upload-csv-dialog"
import { usePathname } from "next/navigation"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const pathname = usePathname()
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter people..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Role"
            options={statuses}
          />
        )}
        {table.getColumn("active_status") && (
          <DataTableFacetedFilter
            column={table.getColumn("active_status")}
            title="Priority"
            options={active_statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <Upload_csv_dialog button_title={"Upload .csv"} route="members" teamId={pathname.split("/")[pathname.split("/").length - 1]} />
        <AddMemberDialog />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
