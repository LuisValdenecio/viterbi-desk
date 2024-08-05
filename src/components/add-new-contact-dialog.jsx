'use client';

import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { postContact } from '@/server-actions/contacts';
import { useState } from 'react'

export function New_Contact_Dialog({button_title : btn_title}) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log(name, email)
    await postContact({name, email})
    
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        {btn_title}
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Contact</DialogTitle>
          <DialogDescription>
            Add a valid email address to your contacts
          </DialogDescription>
          <DialogBody>
          


            
            <Field>
              <Label>Name</Label>
              <Input type="name" value={name} onChange={(event) => setName(event.target.value)} name="amount" placeholder="type in the name" required />
            </Field>
            <Field className="mt-4">
              <Label>E-mail</Label>
              <Input type="email" name="email" value={email} required placeholder="abc@gexample" onChange={(event) => setEmail(event.target.value)} />
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