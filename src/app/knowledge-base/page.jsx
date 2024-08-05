import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { getOrders } from '@/data'

import { getContacts } from '@/server-actions/contacts'

export const metadata = {
  title: 'Orders',
}

export default async function Orders() {
  let contacts = await getContacts()
  console.log(contacts)

  return (
    <>
      <h1>hi there</h1>
    </>
  )
}
