"use client"

import * as React from "react"
import { Dialog } from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Gmail } from "@/components/svg-icons"

const FormSchema = z.object({
  read_access: z.boolean().default(false),
  read_and_write_access : z.boolean().default(false),
  full_access : z.boolean().default(false)
})

export  function GmailProviderDialog({open, close}) {
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver : zodResolver(FormSchema),
    defaultValues : {
      read_access : false,
      read_and_write_access : false,
      full_access : false,
    }
  })
  
  return (
    <>
      <Dialog open={open} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-1">
              <Gmail />
              <span>
                Gmail scope Configuration
              </span>
            </DialogTitle>
            <DialogDescription>
            This channel needs certain permissions to access your Gmail account. Review the requested access levels below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form action={'/api/gmail-oauth-flow'}>
              <FormField 
                control={form.control}
                name="read_access"
                render={({ field }) => (
                  <FormItem>
                    <input className="hidden" type="text" name="read_access" value={field.value ? 'https://www.googleapis.com/auth/gmail.readonly' : ''} />
                    <FormControl>
                      <div className="flex items-start justify-between space-x-4 pt-3">
                        <Switch name="show" id="show" checked={field.value} onCheckedChange={field.onChange} />
                        <Label className="grid gap-1 font-normal" htmlFor="show">
                          <span className="font-semibold">
                            Read 
                          </span>
                          <span className="text-sm text-muted-foreground">
                          Read all resources and their metadata, without write operations. Appropriate for tasks that just read emails.
                          </span>
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField 
                control={form.control}
                name="read_and_write_access"
                render={({ field }) => (
                  <FormItem>
                    <input className="hidden" type="text" name="read_and_write_access" value={field.value ? 'https://www.googleapis.com/auth/gmail.modify' : ''} />
                    <FormControl>
                      <div className="flex items-start justify-between space-x-4 pt-3">
                        <Switch name="show" id="show" checked={field.value} onCheckedChange={field.onChange} />
                        <Label className="grid gap-1 font-normal" htmlFor="show">
                          <span className="font-semibold">
                            Read & Write
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Read all emails and their respective metadata, without write operations.
                          </span>
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField 
                control={form.control}
                name="full_access"
                render={({ field }) => (
                  <FormItem>
                    <input className="hidden" type="text" name="full_access" value={field.value ? 'https://mail.google.com/' : ''} />
                    <FormControl>
                      <div className="flex items-start justify-between space-x-4 pt-3">
                        <Switch name="show" id="show" checked={field.value} onCheckedChange={field.onChange} />
                        <Label className="grid gap-1 font-normal" htmlFor="show">
                          <span className="font-semibold">
                            Full Access
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Full access to the mailbox, including permanent deletion of threads and messages.
                          </span>
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={(!form.getValues('full_access') && !form.getValues('read_access') && !form.getValues('read_and_write_access')) ? true : false}>
                  Connect
                </Button>
              </DialogFooter>
            </form>
          </Form>
          
        </DialogContent>
      </Dialog>
    </>
  )
}
