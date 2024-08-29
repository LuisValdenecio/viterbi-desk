'use client'

import {

    Globe,
    Loader2
  } from "lucide-react"
  

  import { Button } from "@/components/ui/button"
  import { postTeam } from "@/server-actions/teams"
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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

  export function SubmitBtn() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
          {pending ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" />) : 'Create Team'}
        </Button>
    )
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


    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const [selectedProvider, setSelectedProvider] = useState(null)
    const { toast } = useToast()

    /* ----- FORM STUFF ------- */
    const initialState = {
      errors: {
        teamName: undefined,
        description : undefined
      },
      message: undefined
    };

    const initialValues: {teamName : string, description : string} = {
        teamName: "",
        description : ""
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
  