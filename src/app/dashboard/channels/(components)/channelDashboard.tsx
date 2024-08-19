
'use client'

import { CreateAgentDialog } from '../(components)/createAgentDialog'
import { BarGraph } from '../(components)/barGraph'
import { CircleGraph } from '../(components)/circleGraph'
import { ListAgents } from '../(components)/listAgents'
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { usePathname } from 'next/navigation'


export function ChannelDashboard() {

  const path = usePathname()
  const channelId = path.split("/")[path.split("/").length - 1]
  console.log(channelId)

  return (
    <div className="flex min-h-[600px] w-full flex-col bg-muted/40">
      
      <div className="flex flex-col sm:gap-4 sm:py-4 ">
        
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-2">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            
            <Tabs defaultValue="overview">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="agents">Agents</TabsTrigger>
                  <TabsTrigger value="month">Reports</TabsTrigger>
                  
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                 
                  <CreateAgentDialog />
                </div>
              </div>
              <TabsContent value="overview" >
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardContent className="pt-6">
                    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
                    <BarGraph />
                   
                    <CircleGraph />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="agents">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardContent className="">
                    <ListAgents channelId={channelId} />
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
