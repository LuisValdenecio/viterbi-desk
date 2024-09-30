'use client'

import { RegisterNewChannel } from '../(components)/registerChannel'
import {
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

export default function Settings() {

  const description = `
    Please, fill in all the fields to create a new Channel
  `

  return (
    <>
      <div className="mb-4">

      <CardTitle className='mb-2'>{"Register a channel"}</CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
      </div>
      
      <RegisterNewChannel />
      
    
    </>
)}
