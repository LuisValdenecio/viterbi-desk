'use client'
import * as React from "react"

import {

    Globe,
    Loader2
  } from "lucide-react"
  
  import useSWR from 'swr'
  import { Button } from "@/components/ui/button"
  import { postChannel } from "@/server-actions/channels"
  import { usePathname, useRouter } from "next/navigation";
  import { useEffect, useState } from "react"
  
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
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

  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  import { useForm } from "react-hook-form"

  import { zodResolver } from "@hookform/resolvers/zod"

//@ts-ignore
import { useFormStatus } from "react-dom";
import { useFormState } from 'react-dom'
import { z } from "zod"
import { useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import { GmailProviderDialog } from "../(components)/gmail-provider-dialog/provider"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import Loader_component from "@/components/loader"
import SubmitBtn from "@/components/submit-button"
import { TeamSelect } from "./team-select-ui/select-ui"
import { AzureSvgIcon, Discord, Gmail, SlackSVGIcon, StripeSvgIcon } from "@/components/svg-icons"
import Link from "next/link"
  
  function transformResultData (results : Array<any>) {
    console.log("RESULTS", results)
    const teams = results.map((team) => {
      return {value : team.team_id, label : team.name}
    })
    return teams 
  }

  const formSchema = z.object({
    channelName : z.string().min(1, {
      message : 'Please enter a valid name.'
    }),
    provider :  z.string().min(1, {
      message : 'Please enter a valid name.'
    }),
    token :  z.string().min(1, {
      message : 'Please enter a valid name.'
    }),
    description : z.string().min(1,{
      message : 'Please enter a provider'
    }),
    team :  z.string().min(1,{
      message : 'Please enter select a team.'
    }),
  })

  const providers = [
    {
      value: "Gmail",
      label: "Gmail",
      icon : Gmail,
      href : '/dashboard/channels/new?provider=Gmail'
    },
    {
      value: "Discord",
      label: "Discord",
      icon : Discord,
      href : '/dashboard/channels/new?provider=Discord'
    },
    {
      value: "Stripe",
      label: "Stripe",
      icon : StripeSvgIcon,
      href : '/dashboard/channels/new?provider=Stripe'
    },
    {
      value: "Slack",
      label: " Slack",
      icon : SlackSVGIcon,
      href : '/dashboard/channels/new?provider=Slack'
    },
  ]

  const fetcher = (...args) => fetch(...args).then(res => res.json())

  export function ComboboxDemo() {
    const searchParams = useSearchParams();
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(searchParams.get('provider')?.toString().split("-")[0] || "")
    
    useEffect(() => {
      if (searchParams.get('provider')?.toString()) {
        setValue(searchParams.get('provider')?.toString().split("-")[0])
      } else {
        setValue("")
      }
    }, [ searchParams ]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            value={searchParams.get('provider')?.toString().split("-")[0]}
            className="w-full justify-between"
          >
            {value
              ? providers.find((framework) => framework.value === value)?.label
              : "Select provider..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No provider found.</CommandEmpty>
              <CommandGroup>
                {providers.map((provider) => (
                  <CommandItem
                    key={provider.value}
                    value={provider.value}
                    asChild
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Link className="flex gap-1" href={provider.href}>
                      <provider.icon />
                      {provider.label}
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  export function RegisterNewChannel() {

    const router = useRouter()
    const pathname = usePathname()
    const [gmailProvider, setGmailProvider] = useState(false)
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const { replace } = useRouter()
    const [providerValue, setProviderValue] = React.useState("")
    
    const { data, isLoading, error } = useSWR(`/api/my-teams`, fetcher)

    let teams 
    if (!isLoading) {
      teams = transformResultData(data.teams)
    }

    const onDialogClose = () => {
      setGmailProvider(false)
      params.delete('provider')
      replace(`${pathname}?${params.toString()}`)
    }

    const [selectedProvider, setSelectedProvider] = useState(null)
    const { toast } = useToast()

    /* ----- FORM STUFF ------- */
    const initialState = {
      errors: {
        channelName: undefined,
        provider: undefined,
        token: undefined,
        description : undefined,
        team : undefined
      },
      message: undefined
    };

    const initialValues: {channelName : string, provider : string, token : string, description : string, team : string} = {
      channelName: "",
      provider: searchParams.get("provider")?.split("-")[0],
      token: searchParams.get("provider"),
      description : "",
      team : ""
    };

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: initialValues
    })

    const [state, formAction] = useFormState(postChannel, initialState);
    /* ----- */

  
    if (searchParams.get("provider")?.split("-")[1]) {
        if (selectedProvider !== 'Gmail') {
          setSelectedProvider('Gmail')
          toast({
            title: "Gmail Authorization status ",
            description: "Success",
          })
        }
    }

    useEffect(() => {

      setGmailProvider(false)
      if (searchParams.get('provider')?.toString() === 'Gmail') {
        setGmailProvider(true)
      }

      if (state?.message) {
        if (state?.message === 'Success') {
          router.push(`/dashboard/channels/${state?.channelId}`)
        }        
      }
      
      if (Array.isArray(state?.errors)) {
        state.errors.forEach((error) => {
          form.setError(error.field, { message: error.message });
        })
      }
    }, [state?.errors, searchParams]);
    
    if (error) return <div>falhou em carregar</div>
    if (isLoading) return <Loader_component />
    return (
      <div className="grid">

        <GmailProviderDialog open={gmailProvider} close={onDialogClose} />
       
        <div className="flex flex-col">
         
          <main className="grid flex-1 gap-4 overflow-auto  ">
            <div
              className="relative  flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
            >
               <Form {...form}>
                  <form action={formAction} className="grid w-full items-start gap-6">

                      <FormField
                        control={form.control}
                        name="provider"
                        render={({ field }) => (
                          <FormItem >
                            <FormControl>
                              <div>
                                <ComboboxDemo />
                                <Input className="hidden" value={searchParams.get('provider')?.toString().split("-")[0]} placeholder="type in the name of the channel" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage>{state?.errors?.provider}</FormMessage>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="channelName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="type in the name of the channel" {...field} />
                            </FormControl>
                            <FormMessage>{state?.errors?.channelName}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="token"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <Input defaultValue={searchParams.get("provider")} {...field} />
                            </FormControl>
                            <FormMessage>{state?.errors?.channelName}</FormMessage>
                          </FormItem>
                        )}
                      />
 
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea name="description" placeholder="Type a short description of what you expect this agent to do." {...field}/>
                            </FormControl>
                            <FormMessage>{state?.errors?.description}</FormMessage>
                          </FormItem>
                        )}
                      />

                    <FormField
                      control={form.control}
                      
                      name="team"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Team</FormLabel>
                          <FormControl>
                              <div className="w-full">
                                <Input className="hidden" {...field} />
                                <TeamSelect
                                  options={teams}
                                  onValueChange={field.onChange}
                                  defaultValue={""}
                                  placeholder="Select the team that will own this channel"
                                  variant="inverted"
                                  animation={2}
                                  maxCount={3}
                                />
                              </div>
                            </FormControl>
                            <FormMessage>{state?.errors?.team}</FormMessage>
                        </FormItem>
                      )}
                    />
                  
                      <SubmitBtn>
                        Save Channel
                      </SubmitBtn>
                      
                    
                  </form>
               </Form>
              
            </div>
           
          </main>
        </div>
      </div>
    )
  }
  