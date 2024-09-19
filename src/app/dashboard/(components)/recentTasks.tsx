'use client'

import Link from "next/link"
import useSWR from 'swr'
import { useFormStatus } from "react-dom";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ArrowUpRight, Loader2, Play } from "lucide-react"
import Loader_component from "@/components/loader"
import { executeTask } from "@/server-actions/tasks"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export const description =
    "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image."

export default function RecentTasks() {

    const { data, isLoading, error } = useSWR(`/api/tasks`, fetcher)
    if (error) return <div>falhou em carregar</div>
    return (
        <Card
            className="xl:col-span-1" x-chunk="dashboard-01-chunk-4"
        >
            {isLoading ? (
                <div className="h-full flex items-center justify-center">
                    <Loader_component />
                </div>
            ) : (
                <div>
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Tasks</CardTitle>
                            <CardDescription>
                                Recent tasks
                            </CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/dashboard/tasks">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>

                        {data.tasks.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden xl:table-column">
                                            Type
                                        </TableHead>
                                        <TableHead className="hidden xl:table-column">
                                            Status
                                        </TableHead>
                                        <TableHead className="hidden xl:table-column">
                                            Date
                                        </TableHead>
                                        <TableHead className="text-right">Execute</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {data.tasks.filter((task, index) => index <= 3).map((ele, index) => (

                                        <TableRow key={index} className="w-full">
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="text-xs text-muted-foreground">
                                                                {ele.name.split("").filter((a, i) => i < 15).join("") + "..."}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{ele.name}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell className="hidden xl:table-column">

                                            </TableCell>
                                            <TableCell className="hidden xl:table-column">
                                                <Badge className="text-xs" variant="outline">

                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end">
                                                    <form action={executeTask}>
                                                        <input type="text" name="task-id" className="hidden" value={ele.task_id} />
                                                        <SubmitBtn />
                                                    </form>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                    ))}

                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col justify-center items-center gap-4 mb-4">

                                <p className="text-sm text-muted-foreground">
                                    You dont seem to have tasks
                                </p>
                                <Button variant="outline" asChild size="sm" className="">
                                    <Link href={`/dashboard/agents-onboard`} className="text-muted-foreground">
                                        create one
                                        <ArrowUpRight className="h-3 w-3" />
                                    </Link>
                                </Button>

                            </div>
                        )
                        }


                    </CardContent>
                </div>

            )}
        </Card>
    )
}

export function SubmitBtn() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit"
            variant="outline"
            size="sm"
            className="hidden h-8 lg:flex"
            disabled={pending}
        >

            {pending ?
                (
                    <div className="flex items-center text-muted-foreground">
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Run
                    </div>
                ) : (
                    <div className="flex items-center text-muted-foreground">
                        <Play className="mr-2 h-3 w-3" /> Run
                    </div>
                )}
        </Button>
    )
}

