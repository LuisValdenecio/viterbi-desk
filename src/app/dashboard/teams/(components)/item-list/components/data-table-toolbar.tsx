"use client"

import * as React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

import { Plus, PlusCircle, PlusIcon, SquareArrowUpIcon } from "lucide-react"
import { Upload_csv_dialog } from "@/components/upload-csv-dialog"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AzureSvgIcon, GoogleSvgIcon, HubsPotSvgIcon, JiraSvgIcon, SlackSVGIcon, TeamsSvgIcon, WorkDaySvgIcon } from "@/components/svg-icons"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  mutate : any
}

export function DataTableToolbar<TData>({
  table,
  mutate
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  // I'll keep the Authotization URL in here:
  const HubsPotAuthUrl =
  'https://app.hubspot.com/oauth/authorize' +
  `?client_id=${encodeURIComponent(process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID)}` +
  `&scope=settings.users.teams.read` +
  `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_HUBSPOT_REDIRECT_URL)}`; 
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter teams..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("user_role") && (
          <DataTableFacetedFilter
            column={table.getColumn("user_role")}
            title="Your role"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <PlusIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Team
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem asChild>
              <Link className="flex cursor-pointer" href="/dashboard/teams/new">
                New Team
                <DropdownMenuShortcut>
                  <PlusIcon className=" h-4 w-4 text-muted-foreground" />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="flex cursor-pointer" href="/dashboard/teams/new">
                Azure AD
                <DropdownMenuShortcut>
                  <AzureSvgIcon />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="flex cursor-pointer" href="/dashboard/teams/new">
                Microsoft Teams
                <DropdownMenuShortcut>
                  <TeamsSvgIcon />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="flex cursor-pointer" href="/dashboard/teams/slack">
                Slack
                <DropdownMenuShortcut>
                  <SlackSVGIcon />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="flex cursor-pointer" href="/dashboard/teams/new">
                Google Workspace
                <DropdownMenuShortcut>
                  <GoogleSvgIcon />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="flex cursor-pointer" href="/dashboard/teams/new">
                Jira
                <DropdownMenuShortcut>
                  <JiraSvgIcon />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="flex cursor-pointer" href={HubsPotAuthUrl}>
                Hubspot
                <DropdownMenuShortcut>
                  <HubsPotSvgIcon />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="flex cursor-pointer" href="/dashboard/teams/new">
                Workday
                <DropdownMenuShortcut>
                  <WorkDaySvgIcon />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="flex cursor-pointer" href="/dashboard/teams/new">
                Salesforce
                <DropdownMenuShortcut>
                  <PlusIcon className=" h-4 w-4 text-muted-foreground" />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            


          </DropdownMenuContent>
        </DropdownMenu>

        <Upload_csv_dialog button_title="Upload .csv" route="teams" teamId={null} mutate={mutate}  />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}

