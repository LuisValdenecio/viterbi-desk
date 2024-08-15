import { CardHeader_ } from '@/components/cardHeader'
import { CardContent_ } from '@/components/cardContent'

export default async function Page() {

    const description = `
        Please, fill in all the fields to create a new Agent
    `

    return (
        <>
            <CardHeader_ main_title={'New Agent'} description={description} />  
            <CardContent_>
                <h1>Content goes here</h1>
            </CardContent_>
        </>
    )
}