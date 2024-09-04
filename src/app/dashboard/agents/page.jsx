import { ListItemTable } from './(components)/item-list/tableOfItems'
import { getMyAgents } from '@/server-actions/agents'

export default async function Page() {

   const agents = await getMyAgents()

    return (
        <>
            <ListItemTable agents={agents} />
        </>        
    )
}