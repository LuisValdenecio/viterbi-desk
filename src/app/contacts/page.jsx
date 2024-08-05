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
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '@/components/pagination'



export const metadata = {
  title: 'Events',
}

export default async function Events() {
  let events = await getEvents()
  const contacts = await getContacts()
  console.log(contacts)
  //let [isNewContactOpen, setNewContactToOpen] = useState(false)

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
                      <DropdownItem>Edit</DropdownItem>
                      <Remove_Contact_Dialog id={contact._id.toString()} name={contact.name} />
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </li>
          </>
        ))}
      </ul>
      <Pagination className="mt-10">
      <PaginationPrevious href="?page=2" />
      <PaginationList>
        <PaginationPage href="?page=1">1</PaginationPage>
        <PaginationPage href="?page=2">2</PaginationPage>
        <PaginationPage href="?page=3" current>
          3
        </PaginationPage>
        <PaginationPage href="?page=4">4</PaginationPage>
        <PaginationGap />
        <PaginationPage href="?page=65">65</PaginationPage>
        <PaginationPage href="?page=66">66</PaginationPage>
      </PaginationList>
      <PaginationNext href="?page=4" />
    </Pagination>
    </>
  )
}
