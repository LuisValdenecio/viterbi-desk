import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import  Section_Heading  from '@/components/section-heading'

export default async function layout({ children }) {

    const links = [
        {name : 'All channels', href : '/dashboard/channels'},
        {name : 'New', href : '/dashboard/channels/new'},
      
    ]

    return <>
    
        <Heading>Channels</Heading>
        <Section_Heading links={links} />
        
        <div className='mt-4'>{children}</div>
        
    </>
}