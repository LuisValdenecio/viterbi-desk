'use client'

import { usePathname } from 'next/navigation'
import useSWR from 'swr'
//import { ListItemTable } from "../(components)/agents-list/tableOfItems"
import { ListItemTable } from "../(components)/people-list/tableOfItems"
//import { CreateAgentDialog } from "../(components)/createAgentDialog"
import { CreatePersonDialog } from "../(components)/createPersonDialog"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
//import { Overview } from '../(components)/overview/overview'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function fetchTeamData(url) {
  const { data, error, isLoading } = useSWR(url, fetcher)

  return {
    channel: data,
    isLoadingFromChannelFetch: isLoading,
    isErrorFromChannelFetch: error
  }
}

export default function Page() {

  const path = usePathname()
  const teamId = path.split("/")[path.split("/").length - 1]
  const { data, isLoading, error } = useSWR(`/api/people/${teamId}`, fetcher)

  if (error) return <div>falhou em carregar</div>
  if (isLoading) return <div>carregando...</div>
  console.log(data)
  return (
    <>

      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

        <Tabs defaultValue="overview">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
            </TabsList>
            <CreatePersonDialog />
          </div>
          <TabsContent value="overview" >
            
          </TabsContent>
          <TabsContent value="people">
            <div className="">
              <ListItemTable people={data.people} />
            </div>
          </TabsContent>

        </Tabs>
      </div>



    </>

  )

}
