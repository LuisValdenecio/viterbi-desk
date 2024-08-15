import { CardHeader_ } from '@/components/cardHeader'
 

export default async function Page() {

    const description = `
        This page shows all your agents regardless of their status
    `

    return (
        <CardHeader_ main_title={'Agents'} description={description} />  
    )
}