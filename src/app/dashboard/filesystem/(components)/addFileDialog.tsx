'use client'

import * as React from "react"

import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


import { useMediaQuery } from "@/hooks/use-media-query"

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
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { PlusCircle, Loader2, Eye, PencilRuler, Zap, MoveUp, MoveDown, MoveRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { postAgent } from '@/server-actions/agents'
import { usePathname } from 'next/navigation'


//@ts-ignore
import { useFormStatus } from "react-dom";
import { useFormState } from 'react-dom'
import { z } from "zod"
import { useEffect } from "react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Connect'}
    </Button>
  )
}

const frameworks = [
  {
    value: "aws s3",
    label: "AWS S3",
  },
  {
    value: "google cloud",
    label: "Google Cloud Storage",
  },
  {
    value: "microsoft azure data",
    label: "Microsoft Azure Data",
  }
]

const formSchema = z.object({
  agentName: z.string().min(1, {
    message: 'Please enter a valid name for the Agent.'
  }),
  channel: z.string().min(1, {
    message: 'Add a valid channel id'
  }),
  description: z.string().min(1, {
    message: 'Please select a valid action.'
  }),
})

function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full mb-4 justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select storage provider..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Select storage provider..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function CreateDataStorageDialog() {

  const path = usePathname()
  const channelId = path.split("/")[path.split("/").length - 1]

  const initialState = {
    errors: {
      agentName: undefined,
      channel: undefined,
      action: undefined,
      description : undefined
    },
    message: undefined
  };

  const initialValues: { agentName: string, channel: string, description: string } = {
    agentName: "",
    channel: channelId,
    description: ""
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [state, formAction] = useFormState(postAgent, initialState);

  useEffect(() => {

    if (state?.message) {

      /*
      if (state?.message === 'Success') {
        router.push(`/dashboard/agents/${state?.agentID}`)
      }
      */
    }

    if (Array.isArray(state?.errors)) {
      state.errors.forEach((error) => {
        form.setError(error.field, { message: error.message });
      })
    }
  }, [state?.errors]);


  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="#">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add data storage
              </span>
            </Link>
          </Button>
          
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Data Storage</DialogTitle>
            <DialogDescription>
              We support AWS S3, Azure, GCP, and many many more
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form action={formAction}>

              <ComboboxDemo />


              <SubmitBtn />
            </form>
          </Form>

        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="#">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add data storage
              </span>
            </Link>
          </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form action={formAction} className="px-4">

            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="type in the name of the Agent" {...field} />
                  </FormControl>
                  <FormMessage>{state?.errors?.agentName}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="channelId"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Channel id</FormLabel>
                  <FormControl>
                    <Input value="66ba56e122792ceeb8f8cdc8" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid gap-3">
              <Label htmlFor="model">Actions</Label>
              <Select name="action">
                <SelectTrigger
                  id="model"
                  name="action"
                  className="items-start [&_[data-description]]:hidden"
                >
                  <SelectValue placeholder="Select what your agent can do" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Read">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <Eye className="size-5" />
                      <div className="grid gap-0.5">
                        <p>

                          <span className="font-medium text-foreground">
                            Read
                          </span>
                        </p>
                        <p className="text-xs" data-description>
                          Reads all the data and makes reports
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Write">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <PencilRuler className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">
                            Write
                          </span>
                        </p>
                        <p className="text-xs" data-description>
                          Can act on the channel, like sending messages
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Read/Write">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <Zap className="size-5" />
                      <div className="grid gap-0.5">
                        <p>
                          <span className="font-medium text-foreground">
                            Read/Write
                          </span>
                        </p>
                        <p className="text-xs" data-description>
                          The most powerful model for complex
                          computations.
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
                <FormMessage>{state?.errors?.action}</FormMessage>
              </Select>
            </div>
            <SubmitBtn />
          </form>
        </Form>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
