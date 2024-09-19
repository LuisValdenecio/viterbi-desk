'use client'

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export function ListInvitees({invitees}) {
 
  return (
    <>
      <div>
        <DataTable data={invitees} columns={columns} />
      </div>
    </>
  )
}