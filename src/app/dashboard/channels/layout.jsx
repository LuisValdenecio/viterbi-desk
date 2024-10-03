import { BreadCrumpComponent } from '@/components/breadcrump'


/*
<Heading>Channels</Heading>
        <Section_Heading links={links} />
        
        <div className='mt-4'>{children}</div>
*/

export default async function layout({ children }) {

    return <>
        <BreadCrumpComponent description={'Manage your channels, add agents, configure providers, and more'} />
        <div className='mt-2'>
            {children}
        </div>    
    </>
}