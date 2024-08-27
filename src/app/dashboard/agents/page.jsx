import { ListItemTable } from './(components)/item-list/tableOfItems'
import { getAllAgents } from '@/server-actions/agents'

export default async function Page() {

   const agents = await getAllAgents()

    return (
        <>
            <ListItemTable agents={agents} />
        </>        
    )
}