import { Dashboard } from '@/components/data-template'

export default async function layout({ children }) {

    const links = [
        {name : 'All files', href: '/dashboard/filesystem'},
        {name : 'Active', href: '#'},
    ]

    const cta_button = {
        name : 'New Agent',
        href : '/dashboard/agents/new'
    }

    return <> 
       <Dashboard cta_button={cta_button} links={links} addDataStorage={true}>
            {children}
       </Dashboard>
    </>
}