'use client'

import {
    SidebarBody,
    SidebarHeading,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
    SidebarSpacer,
  } from '@/components/sidebar'
  import Sidebar_item from "@/components/sidebar-item";
  import { House, ContactRound, Bot, DatabaseZap, Settings, PencilRuler, Inbox, Search, CircleHelp, Sparkles, CircleUser, Lightbulb, ShieldCheck, LogOut, Eye } from 'lucide-react'
import { usePathname } from 'next/navigation';


export function SiderBarBody({events}) {

    const path = usePathname()
    console.log(path)
    return (
        <SidebarBody>
            <SidebarSection>
              <Sidebar_item href={"/dashboard"} path={"/dashboard"}>
                <House strokeWidth={path === '/dashboard' ? 1.75 : 1.25} size={20} />
                <SidebarLabel>Home</SidebarLabel>
              </Sidebar_item>
              
              <Sidebar_item href={"/dashboard/contacts"} path={"/dashboard/contacts"}>
                <ContactRound strokeWidth={path === '/dashboard/contacts' ? 1.75 : 1.25} size={20} />
                <SidebarLabel>Contacts</SidebarLabel>
              </Sidebar_item>

              <Sidebar_item href={"/dashboard/drafts"} path={"/dashboard/drafts"}>
                <PencilRuler strokeWidth={path === '/dashboard/drafts' ? 1.75 : 1.25} size={20} />
                <SidebarLabel>Drafts</SidebarLabel>
              </Sidebar_item>

              <Sidebar_item href={"/dashboard/agents"} path={"/dashboard/agents"}>
                <Bot strokeWidth={path === '/dashboard/agents' ? 1.75 : 1.25} size={20} />
                <SidebarLabel>Agents</SidebarLabel>
              </Sidebar_item>

              <Sidebar_item href={"/dashboard/knowledge-base"} path={"/dashboard/knowledge-base"}>
                <DatabaseZap strokeWidth={path === '/dashboard/knowledge-base' ? 1.75 : 1.25} size={20} />
                <SidebarLabel>Knowledge base</SidebarLabel>
              </Sidebar_item>

              <Sidebar_item href={"/dashboard/settings"} path={"/dashboard/settings"}>
                <Settings strokeWidth={path === '/dashboard/settings' ? 1.75 : 1.25} size={20} />
                <SidebarLabel>Settings</SidebarLabel>
              </Sidebar_item>
                  
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Events</SidebarHeading>
              {events.map((event) => (
                <SidebarItem key={event.id} href={event.url}>
                  {event.name}
                </SidebarItem>
              ))}
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="#">
                <CircleHelp size={20} strokeWidth={1.25} />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <Sparkles size={20} strokeWidth={1.25} />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
    )
}