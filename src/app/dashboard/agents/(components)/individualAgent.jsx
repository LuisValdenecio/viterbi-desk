'use client'

import useSWR from 'swr'
import { usePathname } from 'next/navigation'
import { CardContent_ } from '@/components/cardContent'
import { CardHeader_ } from '@/components/cardHeader'
import { AgentDashBoard } from '../(components)/agentDashboard'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function IndividualAgent() {

    const path = usePathname()
    const agentId = path.split("/")[path.split("/").length - 1]

    const agentDescription = `Agent description`

    const { data , error, isLoading } = useSWR(`/api/agent/${agentId}`, fetcher)
    console.log(data)

    return (
        <>
            <CardHeader_ main_title={data?.agent?.agentName} description={agentDescription} />

            <CardContent_>
                <AgentDashBoard />
            </CardContent_>
        </>
    )
}