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
    /*
    <form onSubmit={handleSubmit} >
      <Subheading className="my-10 mt-6" >New Channel</Subheading>

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Channel Name</Subheading>
          <Text>A channel can be anything like your email inbox or a discord server.</Text>
        </div>
        <div>
          <Input aria-label="Organization Name" value={name} onChange={(event) => setName(event.target.value)} name="name" placeholder="Ex. Gmail inbox" />
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Connect to an external service</Subheading>
          <Text>This will be displayed on your public profile. Maximum 240 characters.</Text>
        </div>
        <div >
            <New_channel_dialog/>
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Reports</Subheading>
          <Text>This is how customers can contact you for support.</Text>
        </div>
        <div className="space-y-4">
          <SwitchGroup>
            <SwitchField>
              <Label>Show daily reports on the dashboard </Label>
              <Description>Get fresh to your dashboard</Description>
              <Switch name="show_on_events_page" />
            </SwitchField>
            <SwitchField>
              <Label>Allow embedding</Label>
              <Description>Allow others to embed your event details on their own site.</Description>
              <Switch name="allow_embedding" />
            </SwitchField>
          </SwitchGroup>
        </div>
      </section>

     
      
      <Divider className="my-10" soft />

      <div className="flex justify-end gap-4">
        <Button type="reset" plain>
          Reset
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  )
    */
)}
