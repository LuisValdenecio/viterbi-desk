import { Dashboard } from '@/components/data-template'

export default async function layout({ children }) {

    const links = [
        {name : 'All', href: '/dashboard/teams'},
        {name : 'Active', href: '#'},
    ]

    const cta_button = {
        name : 'New Team',
        href : '/dashboard/teams/new'
    }
    

    return <> 
       <Dashboard cta_button={cta_button} links={links} showButtons={true}>
            {children}
       </Dashboard>
    </>
}