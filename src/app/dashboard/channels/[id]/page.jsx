'use client'

import { usePathname } from 'next/navigation'
import useSWR from 'swr'
import { ListItemTable } from "../(components)/agents-list/tableOfItems"
import { CreateAgentDialog } from "../(components)/createAgentDialog"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function fetchChannelData(url) {
  const { data, error, isLoading } = useSWR(url, fetcher)
 
  return {
    channel: data,
    isLoadingFromChannelFetch : isLoading,
    isErrorFromChannelFetch: error
  }
}

export default function Page() {

  const path = usePathname()
  const channelId = path.split("/")[path.split("/").length - 1]
  const { data, isLoading,  error } = useSWR(`/api/agents/${channelId}`, fetcher)
  

  if (error) return <div>falhou em carregar</div>
  if (isLoading) return <div>carregando...</div>
  return (
  <>

<div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

<Tabs defaultValue="overview">
  <div className="flex justify-between items-center pl-2 pr-2 pt-2">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="agents">Agents</TabsTrigger>
    </TabsList>
    <CreateAgentDialog />
  </div>
  <TabsContent value="overview" >
    
  </TabsContent>
  <TabsContent value="agents">
  <div className="p-2">
      <ListItemTable agents={data.agents} />
    </div>
  </TabsContent>

</Tabs>
</div>
    

    
  </>
  
  )
  
}
