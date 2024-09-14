'use client'

import Link from "next/link"
import useSWR from 'swr'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Loader_component from "@/components/loader"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export const description =
    "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image."

export default function RecentAgents() {

    const { data, isLoading, error } = useSWR(`/api/agents`, fetcher)
    if (error) return <div>falhou em carregar</div>
    console.log("DATA: ", data)
    return (
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-5">
            {isLoading ? (
                <div className="h-full flex items-center justify-center">
                    <Loader_component />
                </div>
            ) : (
                <div>
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Agents</CardTitle>
                            <CardDescription>
                                The last 5 added agents
                            </CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/dashboard/agents">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    {(data.filtered || data.my_agents).length > 0 ? (
                        <div>
                            <CardContent className="grid gap-8">
                                {(data.filtered || data.my_agents).filter((task, index) => index <= 4).map((agent) => (
                                    <div className="flex items-center gap-4">
                                        <Avatar className="hidden h-9 w-9 sm:flex">
                                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                            <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">
                                                {agent.name.split("").filter((a, i) => i < 15).join("") + "..."}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {agent.description.split("").filter((a, i) => i < 25).join("") + "..."}
                                            </p>
                                        </div>

                                        <div className="ml-auto font-medium">
                                            <Button variant="outline" asChild size="sm" className="ml-auto gap-1">
                                                <Link href={`/dashboard/agents/${agent.agent_id}`} className="text-muted-foreground">
                                                    view
                                                    <ArrowUpRight className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                            </CardContent>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-4 mb-4">

                            <p className="text-sm text-muted-foreground">
                                You dont seem to have agents
                            </p>
                            <Button variant="outline" asChild size="sm" className="">
                                <Link href={`/dashboard/agents-onboard`} className="text-muted-foreground">
                                    create one
                                    <ArrowUpRight className="h-3 w-3" />
                                </Link>
                            </Button>

                        </div>
                    )}


                </div>
            )}

        </Card>
    )
}
