'use client'

import { CardHeader_ } from '@/components/cardHeader'
import { CardContent_ } from '@/components/cardContent'
import { usePathname } from 'next/navigation'
import { ChannelDashboard } from '../(components)/channelDashboard'
import { Skeleton } from "@/components/ui/skeleton"
import useSWR from 'swr'

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
  const { channel, isLoadingFromChannelFetch, isErrorFromChannelFetch } = fetchChannelData(`/api/channel/${channelId}`)

  return (
    <>
      {!isLoadingFromChannelFetch && (
        <CardHeader_ main_title={channel?.channel?.name} description={channel?.channel?.provider} />
      )}

      {isLoadingFromChannelFetch && (
        <div className="flex items-center space-x-4">
          <div className="space-y-2 p-6">
            <Skeleton className="h-6 w-[300px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
      
      <CardContent_>
        <ChannelDashboard />
      </CardContent_>
      
    </>
  )
}
