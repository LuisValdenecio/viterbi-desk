
import { Button } from '@/components/button'
import { getContactsSearch } from '@/server-actions/channels'
import { Suspense } from 'react'

import {Loading} from './loading'
import { CardHeader_ } from '@/components/cardHeader'
import { CardFooter_ } from '@/components/cardFooter'
import { CardContent_ } from '@/components/cardContent'
/*
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
 */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'


import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
} from "lucide-react"

import Link from 'next/link'

export const metadata = {
  title: 'Channels',
}

function createArrayFromConstant(number) {
  let arr = []
  for (let i = 0; i < number; i++) {
    arr.push(i + 1)
  }
  return arr
}

export default async function Page({ searchParams }) {

  const searchQuery = searchParams.search
  let page = parseInt(searchParams.page, 10)
  page = !page || page < 1 ? 1 : page
  const perPage = 8

  const channels = await getContactsSearch(perPage, page, searchQuery)
  console.log(channels)
  const totalPages = Math.ceil(channels.items_count / perPage)

  const description = `
  This page shows all your channels regardless of their status
  `

  return (
    <>
      <CardHeader_ main_title={'Channels'} description={description} />
      <CardContent_>
        <Suspense fallback={<Loading />}>
          <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
              <TableHead>
                <TableRow>
                  <TableHeader className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHeader>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Provider</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>
                    <span>Actions</span>
                  </TableHeader>
                </TableRow>
                  
              </TableHead>
            
            <TableBody>
            {channels.data.map((channel, index) => (
              <TableRow key={index} href={`/dashboard/channels/${channel._id}`} title={`Order #${channel._id}`}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="32"
                    src="/teams/catalyst.svg"
                    width="32"
                  />
                </TableCell>
                <TableCell className="font-medium">
                {channel.name}
                </TableCell>
                <TableCell>
                    {channel.provider}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {channel.createdAt}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">Active</Badge>
                </TableCell>
              
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        plain
                        size="icon"
                        variant="ghost"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

            ))}
              

            </TableBody>
          </Table>
        </Suspense>
        
        
      </CardContent_>
      <CardFooter_ />
    </>
  )


}
