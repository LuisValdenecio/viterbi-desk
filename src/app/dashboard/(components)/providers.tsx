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
import { ProvidersChart } from "./providersChart"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export const description =
    "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image."

export default function Providers() {

    const { data, isLoading, error } = useSWR(`/api/agents`, fetcher)
    if (error) return <div>falhou em carregar</div>
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
                    </CardHeader>
                    {(data.filtered || data.my_agents).length > 0 ? (
                        <div>
                            <CardContent className="grid gap-8">
                               <ProvidersChart />
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
