import { Dashboard } from '@/components/data-template'
import { BreadCrumpComponent } from '@/components/breadcrump'

export default async function layout({ children }) {

    return <> 
        <BreadCrumpComponent description={'Manage your agents, add tasks, configure scopes, and more'} />
        <div className='mt-2' >
            {children}
        </div>
    </>
}