'use client'

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export function ListItemTable({channels}) {
  return (
    <>
      <div>
        <DataTable data={channels} columns={columns} />
      </div>
    </>
  )
}