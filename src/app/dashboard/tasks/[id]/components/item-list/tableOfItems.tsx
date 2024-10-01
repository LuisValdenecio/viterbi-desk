'use client'

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export function ListItemTable({task_history}) {
 
  return (
    <>
      <div>
        <DataTable data={task_history} columns={columns} />
      </div>
    </>
  )
}