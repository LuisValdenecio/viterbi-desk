'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from "next/link"


export function NoData() {
    return (
        <>
            <main className="flex flex-1 flex-col gap-4 lg:gap-6 ">
                <div
                    className="flex flex-1 p-12 items-center justify-center rounded-lg " x-chunk="dashboard-02-chunk-1"
                >
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        You have no agents
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Agents are the way you get things done here, add one.
                    </p>
                    <Button size="sm" className="mt-2 gap-1" asChild>
                        <Link Link href="/dashboard/agents/new">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            New Agent
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
        </>
    )

}