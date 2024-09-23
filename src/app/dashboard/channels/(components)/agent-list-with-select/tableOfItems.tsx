'use client'

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export function ListItemTable({agents}) {
  return (
    <>
      <div>
        <DataTable data={agents} columns={columns} />
      </div>
    </>
  )
}