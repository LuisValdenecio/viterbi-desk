'use client'


import { postChannel } from '@/server-actions/channels'
import { useState } from 'react'


import {

  CardDescription,

  CardTitle,
} from "@/components/ui/card"
import { RegisterNewTeam } from '../(components)/registerTeam'

/*
export const metadata = {
  title: 'Settings',
}
*/

export default function Settings() {

  const [name, setName] = useState('')
  const [provider, setProvider] = useState('')

  const handleSubmit = async(event) => {
    event.preventDefault()
    await postChannel({name, provider})
  }

  const description = `
    Please, fill in all the fields to create a new team
  `
  
  return (
    <>
      <div className="mb-4">

      <CardTitle className='mb-2'>{"New Team"}</CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
      </div>
      
      <RegisterNewTeam />
      
    
    </>
)}
