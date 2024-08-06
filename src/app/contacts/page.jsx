//'use client';

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/dropdown'
import { Heading } from '@/components/heading'
import { Input, InputGroup } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { getEvents } from '@/data'
import { getContacts } from '@/server-actions/contacts'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'

import { New_Contact_Dialog } from '@/components/add-new-contact-dialog'
import { Remove_Contact_Dialog } from '@/components/remove-contact-dialog'
import { Alter_Contact_Dialog } from '@/components/alter-contact-dialog'
import { Workable_Pagination } from '@/components/workable-pagination'
export const metadata = {
  title: 'Events',
}

function createArrayFromConstant(number) {
  let arr = []
  for (let i = 0; i < number; i++) {
    arr.push(i+1)
  }
  return arr
}

export default async function Page({searchParams}) {

  let page = parseInt(searchParams.page, 10)
  page = !page || page < 1 ? 1 : page
  const perPage = 6

  const contacts = await getContacts(perPage, page)
  console.log("total pages: ",contacts.items_count)
  const totalPages = Math.ceil(contacts.items_count / perPage)
  console.log(totalPages)

  
  

  return (
    <>
      <Heading>Contacts</Heading>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input name="search" placeholder="Search events&hellip;" />
              </InputGroup>
            </div>
            <div>
              <Select name="sort_by">
                <option value="name">Sort by name</option>
                <option value="date">Sort by date</option>
                <option value="status">Sort by status</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex max-w-xl gap-4">
          <New_Contact_Dialog button_title={"New Contact"}/>
        </div>
        
      </div>
      <ul className="mt-10">
        {contacts.data.map((contact, index) => (
          <>
            <li key={contact._id.toString()}>
              <Divider soft={index > 0} />
              <div className="flex items-center justify-between">
                <div key={contact._id.toString()} className="flex gap-6 py-6">
                  
                  <div className="space-y-1.5">
                    <div className="text-base/6 font-semibold">
                      <Link href={contact.email}>{contact.name}</Link>
                    </div>
                    <div className="text-xs/6 text-zinc-500">
                      {contact.createdAt} at {contact.updatedAt} <span aria-hidden="true">·</span> {contact.name}
                    </div>
                    
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="max-sm:hidden" color={true ? 'lime' : 'zinc'}>
                    Active
                  </Badge>
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisVerticalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem href={contact.email}>View</DropdownItem>
                      <Alter_Contact_Dialog id={contact._id.toString()} name={contact.name} email={contact.email} />
                      <Remove_Contact_Dialog id={contact._id.toString()} name={contact.name} />
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </li>
          </>
        ))}
      </ul>
      
      {totalPages > 1 ? (
        <Workable_Pagination totalPagesArray={createArrayFromConstant(totalPages)}/>
      ) : (<></>)}
      
    </>
  )
}
