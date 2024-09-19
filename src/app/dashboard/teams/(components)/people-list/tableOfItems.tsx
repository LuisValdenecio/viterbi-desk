'use client'

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export function ListItemTable({people}) {

  return (
    <>
      <div className="">
        <DataTable data={people} columns={columns} />
      </div>
    </>
  )
}