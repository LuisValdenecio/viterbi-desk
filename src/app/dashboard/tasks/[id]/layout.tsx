import { BreadCrumpComponent } from '@/components/breadcrump'
import Tabs from '../(components)/tabs'

export default async function layout({ children }) {

    return <>
       <BreadCrumpComponent /> 
       <Tabs />
       <div className='mt-2'>
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
