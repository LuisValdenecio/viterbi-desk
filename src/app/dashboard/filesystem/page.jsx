import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { getOrders } from '@/data'

import { ListItemTable } from "./(components)/item-list/tableOfItems"
import { CreateDataStorageDialog } from "./(components)/addFileDialog"

export const metadata = {
  title: 'Orders',
}

export default async function Orders() {
  //let contacts = await getContacts()
  //console.log(contacts)

  const data = []

  return (
    <>
      <ListItemTable files={data} />
    </>
  )
}
