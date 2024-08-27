'use client'

import { usePathname } from 'next/navigation'
import { CreateTaskDialog } from '../(components)/createTaskDialog'
import { ListItemTable } from '../(components)/task-list/tableOfItems'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Page() {

    const path = usePathname()
    const agentId = path.split("/")[path.split("/").length - 1]
    const { data, isLoading,  error } = useSWR(`/api/tasks/${agentId}`, fetcher)

    if (error) return <div>falhou em carregar</div>
    if (isLoading) return <div>carregando...</div>

    return (
        <>
            {/*<IndividualAgent />*/}
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

                <Tabs defaultValue="overview">
                    <div className="flex justify-between items-center pl-2 pr-2 pt-2">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="agents">Tasks</TabsTrigger>
                        </TabsList>
                        <CreateTaskDialog/>
                    </div>
                    <TabsContent value="overview" >

                    </TabsContent>
                    <TabsContent value="agents">
                        <ListItemTable agents={data.tasks} />
                    </TabsContent>

                </Tabs>
            </div>
        </>
    )
}