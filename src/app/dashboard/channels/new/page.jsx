'use client'

import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Divider } from '@/components/divider'
import { Label } from '@/components/fieldset'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'
import { New_channel_dialog } from '@/components/new-channel-dialog'
import { postChannel } from '@/server-actions/channels'
import { useState } from 'react'

import { Description } from '@/components/fieldset'
import { Switch, SwitchField, SwitchGroup } from '@/components/switch'
import { CardHeader_ } from '@/components/cardHeader'
import { CardContent_ } from '@/components/cardContent'
import { RegisterNewChannel } from '../(components)/registerChannel'

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
    Please, fill in all the fields to create a new Channel
  `
  
  return (
    <>
      <CardHeader_ main_title={'New Channel'} description={description} />  
      <CardContent_>
          <RegisterNewChannel />
      </CardContent_>
    
    </>
)}
