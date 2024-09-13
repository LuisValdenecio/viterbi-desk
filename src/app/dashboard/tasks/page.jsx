'use client'

import { usePathname } from 'next/navigation'
import { ListItemTable } from './(components)/task-list/tableOfItems'
import { BreadCrumpComponent } from '@/components/breadcrump'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,    
} from "@/components/ui/tabs"
import useSWR from 'swr'
import Loader_component from '@/components/loader'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Page() {

    const path = usePathname()
    const { data, isLoading,  error } = useSWR(`/api/tasks`, fetcher)

    if (error) return <div>falhou em carregar</div>
    if (isLoading) return <Loader_component />

    return (
        <>
            {/*<IndividualAgent />*/}
            <BreadCrumpComponent />
            <div className="grid mt-2 auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

                <Tabs defaultValue="overview">
                    <div className="flex justify-between items-center">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="overview" >

                    </TabsContent>
                    <TabsContent value="tasks">
                        <ListItemTable agents={data.tasks} />
                    </TabsContent>

                </Tabs>
            </div>
        </>
    )
}