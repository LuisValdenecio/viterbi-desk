'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Users } from "lucide-react"
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

export default function TeamsCard() {

    const { data, isLoading, error } = useSWR(`/api/teams`, fetcher)

    if (error) return <div>falhou em carregar</div>
    console.log("TEAMS : ", data)
    return (
        <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Teams
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                
                {isLoading ? (
                    <Loader_component />
                ) : (
                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <div className="text-2xl font-bold">
                                    {data.teams.teams_owned + data.teams.other_teams}
                                </div> 
                                </TooltipTrigger>
                                <TooltipContent>
                                <p>You own {' '}
                                    {data.teams.teams_owned} {data.teams.teams_owned == 1 ? ' team' : ' teams'}
                                </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className="text-xs text-muted-foreground">
                           All teams, included those you own.
                        </p>
                    </div>
                )}

                
            </CardContent>
        </Card>
    )
}