import { Dashboard } from '@/components/data-template'
import { CardHeader_ } from '@/components/cardHeader'
 
export default async function Page() {

    const description = `
        Manage all your active agents here
    `

    return (
        <CardHeader_ main_title={'Active Agents'} description={description} />
    )
}