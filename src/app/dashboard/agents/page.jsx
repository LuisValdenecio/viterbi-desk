import { CardContent_ } from '@/components/cardContent'
import { CardHeader_ } from '@/components/cardHeader'
import { NoData } from '@/components/no-data'
import { Skeleton_ } from './(components)/skeletons'

export default async function Page() {

    const description = `
        This page shows all your agents regardless of their status
    `

    return (
        <>
            <CardHeader_ main_title={'Agents'} description={description} />  
            <CardContent_ >
                <Skeleton_ />
                {false && <NoData />}
            </CardContent_>
        </>        
    )
}