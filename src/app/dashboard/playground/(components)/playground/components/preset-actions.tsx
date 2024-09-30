"use client"

import * as React from "react"
import { Dialog } from "@radix-ui/react-dialog"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"

import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const FormSchema = z.object({
  read_access: z.boolean().default(false),
  read_and_write_access : z.boolean().default(false),
  full_access : z.boolean().default(false)
})

export function PresetActions() {
  const [open, setIsOpen] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver : zodResolver(FormSchema),
    defaultValues : {
      read_access : false,
      read_and_write_access : false,
      full_access : false,
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("FORM DATA ", data)
    /*
    await fetch('/api/gmail-oauth-flow')
    .then((data) => {
      console.log(data)
    })
      */
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            Content filter preferences
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            Delete preset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Content filter preferences</DialogTitle>
            <DialogDescription>
              The content filter flags text that may violate our content policy.
              It&apos;s powered by our moderation endpoint which is free to use
              to moderate your OpenAI API traffic. Learn more.
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
                            A warning will be shown when sexual, hateful, violent or
                            self-harm content is detected.
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
                    <input className="hidden" type="text" name="read_and_write_access" value={field.value ? 'https://www.googleapis.com/auth/gmail.readonly' : ''} />
                    <FormControl>
                      <div className="flex items-start justify-between space-x-4 pt-3">
                        <Switch name="show" id="show" checked={field.value} onCheckedChange={field.onChange} />
                        <Label className="grid gap-1 font-normal" htmlFor="show">
                          <span className="font-semibold">
                            Read
                          </span>
                          <span className="text-sm text-muted-foreground">
                            A warning will be shown when sexual, hateful, violent or
                            self-harm content is detected.
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
                    <input className="hidden" type="text" name="full-access" value={field.value ? 'https://www.googleapis.com/auth/gmail.readonly' : ''} />
                    <FormControl>
                      <div className="flex items-start justify-between space-x-4 pt-3">
                        <Switch name="show" id="show" checked={field.value} onCheckedChange={field.onChange} />
                        <Label className="grid gap-1 font-normal" htmlFor="show">
                          <span className="font-semibold">
                            Read
                          </span>
                          <span className="text-sm text-muted-foreground">
                            A warning will be shown when sexual, hateful, violent or
                            self-harm content is detected.
                          </span>
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
                <Button type="submit">
                  Connect
                </Button>
              </DialogFooter>
            </form>
          </Form>
          
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This preset will no longer be
              accessible by you or others you&apos;ve shared it with.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false)
                toast({
                  description: "This preset has been deleted.",
                })
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
