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


  return (
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
          <Subheading>Organization Email</Subheading>
          <Text>This is how customers can contact you for support.</Text>
        </div>
        <div className="space-y-4">
          <Input type="text" value={provider} onChange={(event) => setProvider(event.target.value)} aria-label="Organization Email" name="provider" defaultValue="Gmail" />
          <CheckboxField>
            <Checkbox name="email_is_public" defaultChecked />
            <Label>Show email on public profile</Label>
          </CheckboxField>
        </div>
      </section>

      <Divider className="my-10" soft />

      

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Currency</Subheading>
          <Text>The currency that your organization will be collecting.</Text>
        </div>
        <div>
          <Select aria-label="Currency" name="currency" defaultValue="cad">
            <option value="cad">CAD - Canadian Dollar</option>
            <option value="usd">USD - United States Dollar</option>
          </Select>
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
}
