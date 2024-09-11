'use client'

import * as React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { PlusCircle, Loader2, Eye, PencilRuler, Zap, MoveUp, MoveDown, MoveRight, Edit2Icon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

import { zodResolver } from "@hookform/resolvers/zod"
import { getAgent, editAgent } from '@/server-actions/agents'
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
import { editChannel, getChannel } from "@/server-actions/channels"
import SubmitBtn from "@/components/submit-button"
import { editTeam, getTeam } from "@/server-actions/teams"

const formSchema = z.object({
  teamName: z.string().min(1, {
    message: 'Please enter a valid name for the team.'
  }),
  teamId: z.string().min(1, {
    message: 'Please enter a valid id for the team.'
  }),
  description: z.string().min(1, {
    message: 'Please select a valid action.'
  }),
})

export function EditTeamDialog({ team_id }) {

  let team_to_edit : any = null;
  const { toast } = useToast()
  
  const initialState = {
    errors: {
      teamName: undefined,
      teamId : undefined,
      description : undefined
    },
    message: undefined
  };

  const [state, formAction] = useFormState(editTeam, initialState);
  const [teamData, setTeamData] = React.useState("")

  useEffect(() => {

    const fetchData = async () => {
      team_to_edit = await getTeam(team_id)
      setTeamData(team_to_edit)
      console.log("TEAM TO EDIT: ", team_to_edit)
    };

    fetchData().catch((e) => {
      console.error('An error occured while fetching the data');
    });

    if (state?.message) {

      
      if (state?.message === 'Success') {
        setOpen(false)
        toast({
          title: "Task updated",
          description: `${state?.taskName} created successfully`,
          action: (
            <ToastAction altText="Refresh">Undo</ToastAction>
          ),
        })
      }
      
    }

    if (Array.isArray(state?.errors)) {
      state.errors.forEach((error) => {
        form.setError(error.field, { message: error.message });
      })
    }
  }, [state?.errors]);

  const initialValues: { teamName: string, teamId : string, description: string } = {
    teamName: teamData?.name,
    teamId : team_id,
    description: teamData?.description
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-normal h-8 lg:flex w-full flex justify-between border-none"
        >
          Edit 
          <Edit2Icon className="h-4 w-4 text-muted-foreground" />
        </Button>
          
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Agents can do things on your behalf on your channels.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form action={formAction}>

              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input defaultValue={teamData?.name} placeholder="type in the name of the Agent" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.teamName}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Channel id</FormLabel>
                    <FormControl>
                      <Input defaultValue={team_id} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid gap-3 mb-4">
                
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea defaultValue={teamData?.description} name="description" placeholder="Type a short description of what you expect this agent to do." />
                    </FormControl>
                    <FormMessage>{state?.errors?.description}</FormMessage>
                  </FormItem>
                )}
              />

              </div>
              <SubmitBtn>Edit Channel</SubmitBtn>
            </form>
          </Form>

        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" className="h-8 gap-1">

          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Agent
          </span>


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
