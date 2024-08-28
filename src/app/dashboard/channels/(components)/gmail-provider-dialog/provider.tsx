import * as React from "react"

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useEffect } from "react";

const FormSchema = z.object({
    email_access: z.boolean().default(false),
  })

export function GmailProviderDialog({open, close}) {
  //const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={close}>
        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Permission</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <SwitchForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={close}>
      
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <SwitchForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  )
}

export function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Connect'}
    </Button>
  )
}

function simulateAsyncOperation() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Operation completed!");
    }, 10000); // Simulates a 2-second delay
  });
}

export function SwitchForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        email_access: true,
      },
    })
   
    async function onSubmit(data: z.infer<typeof FormSchema>) {
      await fetch('/api/gmail-oauth-flow')
      .then((data) => {
        console.log(data)
      })
    }
   
    return (
      <Form {...form}>
        <form action={'/api/gmail-oauth-flow'} className="w-full space-y-6">
          <div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email_access"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Read Emails
                      </FormLabel>
                      <FormDescription>
                        Alows tasks to read all your inbox
                      </FormDescription>
                    </div>
                    <input className="hidden" type="text" name="read" value={field.value ? 'https://www.googleapis.com/auth/gmail.readonly' : ''} />
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email_access"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-red-200 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Write Emails
                      </FormLabel>
                      <FormDescription>
                      Alows tasks to reoly to messages
                      </FormDescription>
                    </div>
                    <input className="hidden" type="text" name="write" value={field.value ? 'https://mail.google.com/' : ''} />
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
            </div>
          </div>
          <SubmitBtn/>
        </form>
      </Form>
    )
  }