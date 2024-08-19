'use client'

import { CardHeader_ } from '@/components/cardHeader'
import { CardFooter_ } from '@/components/cardFooter'
import { CardContent_ } from '@/components/cardContent'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getChannel } from '@/server-actions/channels'
import { ChannelDashboard } from '../(components)/channelDashboard'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function Page() {

  const path = usePathname()
  const [channelData, setChannelData] = useState([])
  const channelId = path.split("/")[path.split("/").length - 1]

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getChannel(channelId)
        setChannelData(response)
      } catch(error) {
        console.log(error)
      }
    }
    fetchData()  
  }, [])


  return (
    <>
      <CardHeader_ main_title={channelData?.name} description={channelData?.provider} />
      <CardContent_>
        <ChannelDashboard />
      </CardContent_>
      
    </>
  )
}
