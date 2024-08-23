import { CardContent_ } from '@/components/cardContent'
import { CardHeader_ } from '@/components/cardHeader'
import { NoData } from '@/components/no-data'
import { Skeleton_ } from './(components)/skeletons'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteAgentDialog } from '../../dashboard/(components)/deleteAgent'
import { EditAgentDialog } from '../../dashboard/(components)/editAgent'
import useSWR from 'swr'
import { getRecentOrders } from '@/data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { ListAgents } from './(components)/listAgents'




export default async function Page() {


    const description = `
        This page shows all your agents regardless of their status
    `

    return (
        <>
            <ListAgents />
        </>        
    )
}