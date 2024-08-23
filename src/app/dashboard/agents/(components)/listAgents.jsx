'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { getRecentOrders } from '@/data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { getAgentsByChannel } from '@/server-actions/agents'
import { NoData } from '@/components/no-data'
import {
    MoreHorizontal,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteAgentDialog } from '../../(components)/deleteAgent'
import { EditAgentDialog } from '../../(components)/editAgent'
import { Heading, Subheading } from '@/components/heading'
import { Select } from '@/components/select'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function ListAgents() {

    const { data : agents, error : fetchAgentsError, isLoading } = useSWR('/api/allAgents', fetcher)
    return (
        <>

            {(agents?.agents?.length > 0) ? (
                <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableHead>
                        <TableRow>
                            <TableHeader>Agent id</TableHeader>
                            <TableHeader>Creation date</TableHeader>
                            <TableHeader>Agent</TableHeader>
                            <TableHeader>Event</TableHeader>
                            <TableHeader className="text-right">Amount</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {agents?.agents.map((agent) => (
                            <TableRow key={agent.id} href={`/dashboard/agents/${agent._id}`} title={`Agent #${agent.id}`}>
                                <TableCell>{agent.id}</TableCell>
                                <TableCell className="text-zinc-500">{agent.createdAt}</TableCell>
                                <TableCell>{agent.agentName}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar src={""} className="size-6" />
                                        <span>{agent.agentName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-haspopup="true"
                                                plain
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <div className='flex flex-col items-start'>
                                                <EditAgentDialog agentId={agent._id} agentName={agent.agentName} agentAction={agent.action} />
                                                <DeleteAgentDialog agentId={agent._id} agentName={agent.agentName} />
                                            </div>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <NoData />
            )}

        </>
    )
}