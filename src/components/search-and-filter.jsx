'use client'

import { Input, InputGroup } from '@/components/input'
import { useEffect, useState } from 'react'
import { Select } from '@/components/select'
import { New_Contact_Dialog } from '@/components/add-new-contact-dialog'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'


export function Search_and_filter() {

    const router = useRouter()
    const [text, setText] = useState('')
    const [query] = useDebounce(text, 500)

    useEffect(() => {
        if (!query) {
            router.push('/dashboard/contacts')
        } else {
            router.push(`/dashboard/contacts?search=${query}`)
        }
    }, [query, router])

    return <>
    <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input 
                    name="search" 
                    placeholder="Search contacts&hellip;"
                    onChange={e => setText(e.target.value)}
                    />
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
    </>
}