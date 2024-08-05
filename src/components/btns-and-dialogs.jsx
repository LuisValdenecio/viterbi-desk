'use client';

import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { useState } from 'react'

export function Btns_and_dialog({button_title : btn_title}) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        {btn_title}
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>New Contact</DialogTitle>
        <DialogDescription>
          Add a valid email address to your contacts
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>E-mail</Label>
            <Input type="email" name="amount" placeholder="abc@gexample" />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Add contact
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}