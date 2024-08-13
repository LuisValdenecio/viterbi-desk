import {Search_and_filter} from '@/components/search-and-filter'
import { Button } from '@/components/button'
import { getContactsSearch } from '@/server-actions/channels'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu, DropdownLabel } from '@/components/dropdown'
import { ArrowUpRightIcon, EllipsisVerticalIcon, PencilSquareIcon, PlusIcon, StarIcon, TrashIcon } from '@heroicons/react/16/solid'
import { Workable_Pagination } from '@/components/workable-pagination'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Avatar } from '@/components/avatar'

export const metadata = {
  title: 'Channels',
}

function createArrayFromConstant(number) {
  let arr = []
  for (let i = 0; i < number; i++) {
    arr.push(i+1)
  }
  return arr
}

export default async function Page({searchParams}) {

  const searchQuery = searchParams.search
  let page = parseInt(searchParams.page, 10)
  page = !page || page < 1 ? 1 : page
  const perPage = 8

  const channels = await getContactsSearch(perPage, page, searchQuery)
  console.log(channels)
  const totalPages = Math.ceil(channels.items_count / perPage)

  return (
    <>
      <div>
      <Search_and_filter 
          path={'/dashboard/channels'} 
          searchParam={'search'}
          csvBtn={false}
          >
            <Button href="/dashboard/channels/new">
              <PlusIcon/>
              New Channel
            </Button>
           
          </Search_and_filter>
      </div>
      <Table className="mt-6 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Provider</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader className="text-right"></TableHeader>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {channels.data.map((channel, index) => (
            <TableRow key={index} href={`/dashboard/channels/${channel._id}`} title={`Order #${channel.id}`}>
             
              <TableCell >{channel.provider}</TableCell>
              <TableCell>{channel.createdAt}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar src="/teams/catalyst.svg" className="size-6" />
                  <span>{channel.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
              <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisVerticalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem href={"#"} >
                        <StarIcon />
                        <DropdownLabel >Favorite</DropdownLabel>
                      </DropdownItem>
                      <DropdownItem href={"#"} >
                        <TrashIcon/>
                        <DropdownLabel >Delete</DropdownLabel>
                      </DropdownItem>
                      <DropdownItem href={"#"} >
                        <PencilSquareIcon />
                        <DropdownLabel >Edit </DropdownLabel>
                      </DropdownItem>
                      
                    </DropdownMenu>
                  </Dropdown>
              </TableCell>
              
              
            </TableRow>
            
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 ? (
        <Workable_Pagination resourceURL={'/dashboard/channels'} totalPagesArray={createArrayFromConstant(totalPages)}/>
      ) : (<></>)}

    </>
  )
}
