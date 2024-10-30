'use client'

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export function ListItemTable({teams, mutate }) {
 
  return (
    <>
      <div>
        <DataTable data={teams} columns={columns} mutate={mutate}/>
      </div>
    </>
  )
}