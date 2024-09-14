'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Bot, Users } from "lucide-react"
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

export default function AgentsCard() {

    const { data, isLoading, error } = useSWR(`/api/agents`, fetcher)

        if (error) return <div>falhou em carregar</div>
        console.log("TEAMS : ", data)
        return (
        <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Agents
              </CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                
                {isLoading ? (
                    <Loader_component />
                ) : (
                    <div>
                        <div className="text-2xl font-bold">
                            {data?.my_agents?.length || data?.filtered?.length}
                        </div> 
                                
                        <p className="text-xs text-muted-foreground">
                            All the agents from all channels.
                        </p>
                    </div>
                )}

                
            </CardContent>
        </Card>
    )
}