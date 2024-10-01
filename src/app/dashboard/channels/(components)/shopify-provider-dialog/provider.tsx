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
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Gmail, ShopifySvgIcon } from "@/components/svg-icons"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
  grant_access: z.boolean().default(false),
  store_name : z.string().min(1, {
    message : 'Please type in the name of your store'
  })
})

export  function ShopifyProviderDialog({open, close}) {
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver : zodResolver(FormSchema),
    defaultValues : {
      grant_access : false,
      store_name : undefined,
    }
  })

  const [storeName, setStoreName] = React.useState('')

  const handleStoreNameInputChange = (event) => {
    setStoreName(event.target.value)
  }

  
  return (
    <>
      <Dialog open={open} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-1">
              <ShopifySvgIcon />
              <span>
                Shopify scope Configuration
              </span>
            </DialogTitle>
            <DialogDescription>
            To start the integration, please type in the name of your store and agree to the access grant.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form action={'/api/shopify-oauth-flow'}>
              
              <FormField
                control={form.control}
                name="store_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl onChange={handleStoreNameInputChange}>
                      <Input  placeholder="type in the name of the channel" {...field} />
                    </FormControl>
                    <FormMessage>{false ? '' : ''}</FormMessage>
                  </FormItem>
                )}
              />
              
              <FormField 
                control={form.control}
                name="grant_access"
                render={({ field }) => (
                  <FormItem>
                    <input className="hidden" type="text" name="scope_access" value={field.value ? `https://${storeName}.myshopify.com/admin/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID}&scope=write_products,read_shipping&redirect_uri=${process.env.NEXT_PUBLIC_SHOPIFY_REDIRECT_URI}&state=random&grant_options[]` : ''} />
                    <FormControl>
                      <div className="flex items-start justify-between space-x-4 pt-3">
                        <Switch name="show" id="show" checked={field.value} onCheckedChange={field.onChange} />
                        <Label className="grid gap-1 font-normal" htmlFor="show">
                          <span className="font-semibold">
                            Grant Access
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
            
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={(storeName === '' || !form.getValues('grant_access')) ? true : false}>
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
