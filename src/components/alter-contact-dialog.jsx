'use client';

import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { DropdownItem } from '@/components/dropdown'

import { Description, Field, FieldGroup, Fieldset, Label, Legend } from '@/components/fieldset'

import { Select } from '@/components/select'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'


import { Input } from '@/components/input'
import { postContact } from '@/server-actions/contacts';
import { useState } from 'react'

import { updateContact } from '@/server-actions/contacts';

export function Alter_Contact_Dialog({id, name, email}) {
  const [isOpen, setIsOpen] = useState(false)
  const [_name, setName] = useState(name)
  const [_email, setEmail] = useState(email)

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log(id, _name, _email)
    await updateContact(id, _name, _email)
    
  }
  return (
    <>


      <DropdownItem onClick={(event) => {event.preventDefault(); setIsOpen(true)}}>Edit</DropdownItem>
      
      <Dialog open={isOpen} onClose={setIsOpen}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>
            Add a valid email address to your contacts
          </DialogDescription>
          <DialogBody>
          


            
            <Field>
              <Label>Name</Label>
              <Input type="name"  onChange={(event) => setName(event.target.value)} name="amount" defaultValue={name} required />
            </Field>
            <Field className="mt-4">
              <Label>E-mail</Label>
              <Input type="email" name="email"  required defaultValue={email} onChange={(event) => setEmail(event.target.value)} />
            </Field>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" >
              Add contact
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}