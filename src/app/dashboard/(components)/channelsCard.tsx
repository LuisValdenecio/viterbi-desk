'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Rss, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useSWR from 'swr'
import Loader_component from "@/components/loader"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function ChannelsCard() {

    const { data, isLoading, error } = useSWR(`/api/channels`, fetcher)

    if (error) return <div>falhou em carregar</div>
    return (
        <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Channels
              </CardTitle>
              <Rss className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                
                {isLoading ? (
                    <Loader_component />
                ) : (
                    <div>
                        
                        <div className="text-2xl font-bold">
                            {data.channels.length}
                        </div>
                               
                        <p className="text-xs text-muted-foreground">
                            All the channels you own.
                        </p>
                    </div>
                )}

                
            </CardContent>
        </Card>
    )
}