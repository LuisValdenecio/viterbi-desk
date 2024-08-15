import { Dashboard } from '@/components/data-template'

export default async function layout({ children }) {

    const links = [
        {name : 'All', href: '/dashboard/agents'},
        {name : 'Active', href: '/dashboard/agents/active'},
    ]

    const cta_button = {
        name : 'New Agent',
        href : '/dashboard/agents/new'
    }

    return <> 
       <Dashboard cta_button={cta_button} links={links}>
            {children}
       </Dashboard>
    </>
}