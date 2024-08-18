import { Dashboard } from '@/components/data-template'
import { CardContent_ } from '@/components/cardContent'
import { CardHeader_ } from '@/components/cardHeader'
import { NoData } from '@/components/no-data'
 
export default async function Page() {

    const description = `
        Manage all your active agents here
    `
    return (
        <>
            <CardHeader_ main_title={'Active Agents'} description={description} />
            <CardContent_ >
                <NoData />
            </CardContent_>
        </>
    )
}