import { BreadCrumpComponent } from '@/components/breadcrump'
import Tabs from '../(components)/tabs'

export default async function layout({ children }) {

    return <>
       <BreadCrumpComponent description={'Manage this task instructions, history, settings reports, and more'} /> 
       <Tabs />
       <div className=''>
            {children}
       </div>
    </>
}


/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
