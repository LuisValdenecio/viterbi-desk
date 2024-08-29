//import { promises as fs } from "fs"
//import path from "path"
//import { Metadata } from "next"
//import Image from "next/image"
//import { z } from "zod"

'use client'

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
//import { UserNav } from "./components/user-nav"
//import { taskSchema } from "./data/schema"


// Simulate a database read for tasks.~
/*
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/app/dashboard/item-list/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())
  console.log(typeof tasks)

  return z.array(taskSchema).parse(tasks)
}
*/

export function ListItemTable({agents}) {
 
  //const tasks = await getTasks()

  return (
    <>
      <div>
        <DataTable data={agents} columns={columns} />
      </div>
    </>
  )
}