import { BreadCrumpComponent } from '@/components/breadcrump'

export default async function layout({ children }) {

    return <>
       <BreadCrumpComponent /> 
       <div className='mt-2'>
            {children}
       </div>
    </>
}