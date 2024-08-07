'use client'

import { SidebarItem } from "./sidebar"
import { usePathname } from "next/navigation"

export default function Sidebar_item({href, path, children}) {

    let pathname = usePathname()

    return <>
        <SidebarItem href={href} current={pathname === path}>
            {children}
        </SidebarItem>
        
    </>
}