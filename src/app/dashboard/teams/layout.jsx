import { BreadCrumpComponent } from '@/components/breadcrump'

export default async function layout({ children }) {

    return <>
       <BreadCrumpComponent description={'Manage your teams, add members, configure permissions, and more'} /> 
       <div className='mt-2'>
            {children}
       </div>
    </>
}