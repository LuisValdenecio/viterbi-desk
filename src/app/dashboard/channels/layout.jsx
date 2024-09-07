import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import  Section_Heading  from '@/components/section-heading'

import { Dashboard } from '@/components/data-template'

/*
<Heading>Channels</Heading>
        <Section_Heading links={links} />
        
        <div className='mt-4'>{children}</div>
*/

export default async function layout({ children }) {

    const links = [
        {name : 'My channels', href : '/dashboard/channels'},
        {name : 'All', href : '/dashboard/channels'},
      
    ]

    const cta_button = {
        name : 'New Channel',
        href : '/dashboard/channels/new'
    }

    return <>
    
        <Dashboard cta_button={cta_button} links={links} showButtons={true} showSearch={false}>
            {children}
        </Dashboard>
        
    </>
}