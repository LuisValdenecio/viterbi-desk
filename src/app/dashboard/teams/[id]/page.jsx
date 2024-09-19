'use client'

import { usePathname } from 'next/navigation'
import useSWR from 'swr'
//import { ListItemTable } from "../(components)/agents-list/tableOfItems"
import { ListItemTable } from "../(components)/people-list/tableOfItems"
import { ListInvitees } from "../(components)/invitees-list/tableOfItems"
import { AddMemberDialog } from "../(components)/createPersonDialog"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import Loader_component from '@/components/loader'
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
  const { data : users, isLoading : usersLoading, error : usersError } = useSWR(`/api/people/${teamId}`, fetcher)
  const { data : invitees, isLoading : inviteesLoading, error : inviteesError } = useSWR(`/api/invitees/${teamId}`, fetcher)

  if (usersError || inviteesError) return <div>falhou em carregar</div>
  if (usersLoading || inviteesLoading) return <Loader_component />
  
  return (
    <>

      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

        <Tabs defaultValue="active">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="active">Members</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" >
            
          </TabsContent>
          <TabsContent value="active">
            <div className="">
              <ListItemTable people={users.people} />
            </div>
          </TabsContent>

          <TabsContent value="invitations">
            <div className="">
              <ListInvitees invitees={invitees.invitees_data} />
            </div>
          </TabsContent>

        </Tabs>
      </div>



    </>

  )

}
