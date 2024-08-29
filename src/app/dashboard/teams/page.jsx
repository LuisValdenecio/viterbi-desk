import { getAllTeams } from '@/server-actions/teams'
import { ListItemTable } from './(components)/item-list/tableOfItems'


export default async function Page() {

    const teams = await getAllTeams()

    return (
        <>
            <ListItemTable teams={teams} />
        </>
    )
}