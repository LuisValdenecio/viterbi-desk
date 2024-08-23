
'use client'

import useSWR from 'swr'
import { CreateAgentDialog } from '../(components)/createAgentDialog'
import { BarGraph } from '../(components)/barGraph'
import { CircleGraph } from '../(components)/circleGraph'
import { ListAgents } from '../(components)/listAgents'
import { Button } from '@/components/ui/button'
import { doSocialLogin } from "@/server-actions/authentication";
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
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Link2Off } from 'lucide-react'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function ConnectButton({authUrl}) {
  return (
    <Button variant='outline'>
      <Link className='flex' href={authUrl || "#"}>
        <ExternalLink className="mr-2 h-4 w-4" /> Connect
      </Link>
    </Button>
  )
}

export function ChannelDashboard() {

  const path = usePathname()
  const channelId = path.split("/")[path.split("/").length - 1]
  let result_ = ""
  
  const { data : channel, error } = useSWR(`/api/channel/${channelId}`, fetcher)
  const { data : agents, error : fetchAgentsError, isLoading } = useSWR(`/api/agents/${channelId}`, fetcher)
  const { data : result, error : error1 } = useSWR(`/api/gmail-auth/${channelId}`, fetcher)
  result_ = result?.authUrl

  if (channel?.channel?.provider === 'Gmail') {

  } else if (channel?.channel?.provider === 'Discord') {
    result_ = "https://discord.com/oauth2/authorize?client_id=1275758132936708136&permissions=8&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fdiscord-consent-response&integration_type=0&scope=bot+identify+guilds"
  }

  return (
    <div className="flex  w-full flex-col bg-muted/40">

      <div className="flex flex-col sm:gap-4 sm:py-4 ">

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-2">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

            <Tabs defaultValue="overview">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="agents">Agents</TabsTrigger>

                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  {!channel?.channel?.refreshToken && (
                    <ConnectButton authUrl={result_} />
                  )}



                  <CreateAgentDialog />
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
