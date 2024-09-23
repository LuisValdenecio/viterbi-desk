'use client'

import {

    Globe,
    Loader2
  } from "lucide-react"
  
  import useSWR from 'swr'
  import { Button } from "@/components/ui/button"
  import { postTeam } from "@/server-actions/teams"
  import { usePathname, useRouter } from "next/navigation";
  import { use, useEffect, useState } from "react"
  import { MultiSelect } from "@/components/multi-select"

  const fetcher = (...args) => fetch(...args).then(res => res.json())

  const frameworksList = [
    { value: "react framework ", label: "React" },
    { value: "angular", label: "Angular" },
    { value: "vue", label: "Vue"},
    { value: "svelte", label: "Svelte"},
    { value: "ember", label: "Ember" },
  ];

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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import Loader_component from "@/components/loader"

  export function SubmitBtn() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
          {pending ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Create Team'}
        </Button>
    )
  }

  function transformResultData (results : Array<any>) {
    console.log("RESULTS", results)
    const channels = results.map((channel) => {
      return {value : channel.channel_id, label : channel.name}
    })
    return channels 
  }

  const formSchema = z.object({
    teamName : z.string().min(1,{
      message : 'Please enter a valid name for the team.'
    }),
   
    description : z.string().min(1,{
      message : 'Please type in a description.'
    }),
})

  export function RegisterNewTeam() {

    const [selectedFrameworks, setSelectedFrameworks] = useState([]);
    const { data, isLoading, error } = useSWR(`/api/channels`, fetcher)
    console.log("DATA : ", data)
    let channels 
    if (!isLoading) {
      channels = transformResultData(data.channels)
    }
      
    console.log(selectedFrameworks)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const [selectedProvider, setSelectedProvider] = useState(null)
    const { toast } = useToast()

    /* ----- FORM STUFF ------- */
    const initialState = {
      errors: {
        teamName: undefined,
        description : undefined,
      },
      message: undefined
    };

    const initialValues: {teamName : string, description : string } = {
        teamName: "",
        description : "",
    };

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: initialValues
    })

    const [state, formAction] = useFormState(postTeam, initialState);
    /* ----- */


    useEffect(() => {

      if (state?.message) {
        if (state?.message === 'Success') {
          router.push(`/dashboard/teams/${state?.teamId}`)
        }        
      }
      
      if (Array.isArray(state?.errors)) {
        state.errors.forEach((error) => {
          form.setError(error.field, { message: error.message });
        })
      }
    }, [state?.errors]);
    
    if (error) return <div>falhou em carregar</div>
    if (isLoading) return <Loader_component />
    return (
      <div className="grid">

        <div className="flex flex-col">
         
          <main className="grid flex-1 gap-4 overflow-auto  ">
            <div
              className="relative  flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
            >
               <Form {...form}>
                  <form action={formAction} className="grid w-full items-start gap-6">

                      <FormField
                        control={form.control}
                        name="teamName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="type in the name of the channel" {...field} />
                            </FormControl>
                            <FormMessage>{state?.errors?.teamName}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="">
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
  