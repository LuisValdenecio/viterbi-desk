'use client'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import {
    Card,
    CardContent,
  } from "@/components/ui/card"
import { CreateTaskDialog } from './createTaskDialog'
import useSWR from 'swr'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Play, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom";
import { TaskCompletedDrawer } from '../(components)/taskCompletedDialog'  
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { executeTask } from "@/server-actions/tasks"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button variant="outline" size="sm" className="h-8 gap-1" type="submit" disabled={pending}>
      {pending ? 
        (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Run task
          </div>
        ) : 
        (
          <div className="flex items-center">
            <Play className="mr-2 h-4 w-4" /> Run task
          </div>
        )
      }
    </Button>
  
  )
}

export function simulateAsyncOperation() {
  
  return new Promise((resolve) => {
    setTimeout(() => {
      
    }, 1000); // Simulates a 2-second delay
  });
}

export function AgentDashBoard() {

  const path = usePathname()
  const agentId = path.split("/")[path.split("/").length - 1]
  const { toast } = useToast()

  const { data, isLoading,  error } = useSWR(`/api/tasks/${agentId}`, fetcher)

  return (
      <div className="flex  w-full flex-col bg-muted/40">

    <div className="flex flex-col sm:gap-4 sm:py-4 ">

      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          

          <Tabs defaultValue="overview">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>

              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                  <CreateTaskDialog/>
              </div>
            </div>
            <TabsContent value="overview" >
              <Card x-chunk="dashboard-05-chunk-3">
                <CardContent className="pt-6">
                  <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
                    {/*
                      <BarGraph />
                  
                  <CircleGraph />
                  
                  */}

                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="actions">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardContent className="pt-6">
                  <div className="grid flex-1 items-start gap-4 md:gap-8">
                      {(data?.tasks?.length > 0) ? (
                         <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                         <TableHead>
                             <TableRow>
                                 <TableHeader>TaskName</TableHeader>
                                 <TableHeader>Date</TableHeader>
                                 <TableHeader>Execute Task</TableHeader>
                             </TableRow>
                         </TableHead>
                         <TableBody>
     
                             {data?.tasks.map((task) => (
                                 <TableRow key={task._id} >
             
                                     <TableCell>{task.taskName}</TableCell>
                                     <TableCell className="text-zinc-500">{task.createdAt}</TableCell>
                                     <TableCell className="text-zinc-500">
                                      <form action={executeTask}>
                                        <input type="text" name="task-agent" className="hidden" value={task?.agent} />
                                        <SubmitBtn/>
                                      </form>
                                      
                                     </TableCell>

                                 </TableRow>
                             ))}
                         </TableBody>
                     </Table>
                      ) : (
                        <h1>NO ACTION</h1>
                      )}  
                    

                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>

      </main>
    </div>
  </div>
  )
}