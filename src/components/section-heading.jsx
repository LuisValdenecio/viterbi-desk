'use client'

import { Navbar, NavbarDivider, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from '@/components/navbar'
import { usePathname } from 'next/navigation'

export default function Section_Heading({links}) {

  const pathname = usePathname()
  console.log(pathname)
  return (
    <Navbar >

    
      <NavbarSection >
        {links.map((link, index) => (
          <NavbarItem href={link.href} key={index} current={link.href === pathname}>
            {link.name}
          </NavbarItem>
        ))}
        
        
      </NavbarSection>
      <NavbarSpacer />
      
    </Navbar>
  )
}