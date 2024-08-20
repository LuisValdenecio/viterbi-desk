
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

export function ChannelDashboard() {

  const path = usePathname()
  const channelId = path.split("/")[path.split("/").length - 1]

  const [user, setUser] = useState(null)

   // obtendo os dados data
   useEffect(() => {
    fetch(`/api/gmail-auth/${channelId}`)
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])

  console.log(user?.authUrl)

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
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="stream">Stream</TabsTrigger>
                  
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                
                    <Button asChild variant="outline" className="flex w-full items-center justify-center gap-3" type="submit"
                      name="action" value="google">
                        <Link href={user?.authUrl || '#'}>
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                            <path
                              d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                              fill="#EA4335"
                            />
                            <path
                              d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                              fill="#4285F4"
                            />
                            <path
                              d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                              fill="#34A853"
                            />
                          </svg>
                          <span className="text-sm font-semibold leading-6">Connect</span>
                        </Link>
                    </Button>
                  
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
              <TabsContent value="stream">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardContent className="">
                    
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
