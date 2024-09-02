'use client'

import {

    Globe,
    Loader2
  } from "lucide-react"
  

  import { Button } from "@/components/ui/button"
  import { postChannel } from "@/server-actions/channels"
  import { usePathname, useRouter } from "next/navigation";
  import { useEffect, useState } from "react"

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

  export function SubmitBtn() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
          {pending ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Create channel'}
        </Button>
    )
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
    })
  })

  export function RegisterNewChannel() {


    const router = useRouter()
    const pathname = usePathname()
    const [gmailProvider, setGmailProvider] = useState(false)
    const searchParams = useSearchParams();
    const [selectedProvider, setSelectedProvider] = useState(null)
    const { toast } = useToast()

    /* ----- FORM STUFF ------- */
    const initialState = {
      errors: {
        channelName: undefined,
        provider: undefined,
        token: undefined,
        description : undefined
      },
      message: undefined
    };

    const initialValues: {channelName : string, provider : string, token : string, description : string} = {
      channelName: "",
      provider: searchParams.get("provider")?.split("-")[0],
      token: searchParams.get("provider"),
      description : ""
    };

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: initialValues
    })

    const [state, formAction] = useFormState(postChannel, initialState);
    /* ----- */

    const setProvider = (value : any) => {
      if (value === 'Gmail') {
        setGmailProvider(true)
      }
    }

    if (searchParams.get("provider")?.split("-")[0] === 'Gmail') {
        if (selectedProvider !== 'Gmail') {
          setSelectedProvider('Gmail')
          toast({
            title: "Gmail Authorization status ",
            description: "Success",
          })
        }
    }

    useEffect(() => {

      console.log(state?.message)

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
    }, [state?.errors]);
    
    return (
      <div className="grid">

        <GmailProviderDialog open={gmailProvider} close={setGmailProvider} />
       
        <div className="flex flex-col">
         
          <main className="grid flex-1 gap-4 overflow-auto  ">
            <div
              className="relative  flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
            >
               <Form {...form}>
                  <form action={formAction} className="grid w-full items-start gap-6">

                      <div className="grid gap-3">
                        <Label htmlFor="model">Provider</Label>
                        <Select name="provider" onValueChange={setProvider} defaultValue={searchParams.get("provider")?.split("-")[0]}>
                          <SelectTrigger
                            id="model"
                            name="provider"
                            className="items-start [&_[data-description]]:hidden"
                            
                          >
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gmail">
                              <div className="flex items-start gap-3 text-muted-foreground">      
                                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24px" height="24px"><path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"/><path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"/><polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"/><path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"/><path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"/></svg>
                                <div className="grid gap-0.5">
                                  
                                  <p>
                                    
                                    <span className="font-medium text-foreground">
                                      Gmail
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                    Synchronize your Gmail inbox and automate your workflow
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="Google Calendar">
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24px" height="24px"><rect width="22" height="22" x="13" y="13" fill="#fff"/><polygon fill="#1e88e5" points="25.68,20.92 26.688,22.36 28.272,21.208 28.272,29.56 30,29.56 30,18.616 28.56,18.616"/><path fill="#1e88e5" d="M22.943,23.745c0.625-0.574,1.013-1.37,1.013-2.249c0-1.747-1.533-3.168-3.417-3.168 c-1.602,0-2.972,1.009-3.33,2.453l1.657,0.421c0.165-0.664,0.868-1.146,1.673-1.146c0.942,0,1.709,0.646,1.709,1.44 c0,0.794-0.767,1.44-1.709,1.44h-0.997v1.728h0.997c1.081,0,1.993,0.751,1.993,1.64c0,0.904-0.866,1.64-1.931,1.64 c-0.962,0-1.784-0.61-1.914-1.418L17,26.802c0.262,1.636,1.81,2.87,3.6,2.87c2.007,0,3.64-1.511,3.64-3.368 C24.24,25.281,23.736,24.363,22.943,23.745z"/><polygon fill="#fbc02d" points="34,42 14,42 13,38 14,34 34,34 35,38"/><polygon fill="#4caf50" points="38,35 42,34 42,14 38,13 34,14 34,34"/><path fill="#1e88e5" d="M34,14l1-4l-1-4H9C7.343,6,6,7.343,6,9v25l4,1l4-1V14H34z"/><polygon fill="#e53935" points="34,34 34,42 42,34"/><path fill="#1565c0" d="M39,6h-5v8h8V9C42,7.343,40.657,6,39,6z"/><path fill="#1565c0" d="M9,42h5v-8H6v5C6,40.657,7.343,42,9,42z"/></svg>
                                <div className="grid gap-0.5">
                                  <p>
                                    <span className="font-medium text-foreground">
                                      Google Calendar
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                    Performance and speed for efficiency.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="Discord">
                              <div className="flex items-start gap-3 text-muted-foreground">          
                                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24px" height="24px"><path fill="#8c9eff" d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"/></svg>
                                <div className="grid gap-0.5">
                                  <p>
                                    <span className="font-medium text-foreground">
                                      Discord
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                    The most powerful model for complex computations.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="custom" >
                              <div className="flex items-start gap-3 text-muted-foreground">          
                                <Globe size={20} />
                                <div className="grid gap-0.5">
                                  <p>
                                    <span className="font-medium text-foreground">
                                      Custom
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                    Connect to an API or database
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                           
                          </SelectContent>
                          <FormMessage>{state?.errors?.provider}</FormMessage>
                        </Select>
                      </div>
                    
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
                          <FormItem className="mb-4">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea name="description" placeholder="Type a short description of what you expect this agent to do." {...field}/>
                            </FormControl>
                            <FormMessage>{state?.errors?.description}</FormMessage>
                          </FormItem>
                        )}
                      />
                  
                    
                      <SubmitBtn />
                      
                    
                  </form>
               </Form>
              
            </div>
           
          </main>
        </div>
      </div>
    )
  }
  