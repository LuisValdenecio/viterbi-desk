'use client';

import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { DropdownItem } from '@/components/dropdown'

import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { postContact } from '@/server-actions/contacts';
import { useState } from 'react'

import { deleteContact } from '@/server-actions/contacts';

export function Remove_Contact_Dialog({name, id}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    //console.log(name, email)
    await deleteContact(id)
    
  }
  return (
    <>


      <DropdownItem onClick={(event) => {event.preventDefault(); setIsOpen(true)}}>Delete</DropdownItem>
      
      <Dialog open={isOpen} onClose={setIsOpen}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Delete Contact</DialogTitle>
          <DialogDescription>
           Are you sure you want to delete <b>{name}</b>? This is irreversible.
          </DialogDescription>
          
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color="red" type="submit" >
              Remove
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}