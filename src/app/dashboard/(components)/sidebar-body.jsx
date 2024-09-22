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
  import { House, ContactRound, Bot, DatabaseZap, Settings, PencilRuler, Inbox, Search, CircleHelp, Sparkles, CircleUser, Lightbulb, ShieldCheck, LogOut, Eye, Rss, Users, ListCheckIcon } from 'lucide-react'
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';


export function SiderBarBody({events}) {

    const path = usePathname()

    return (
        <SidebarBody>
            <SidebarSection>
              <Sidebar_item href={"/dashboard"} path={"/dashboard"}>
                <House strokeWidth={path === '/dashboard' ? 1.75 : 1.25} size={18} />
                <SidebarLabel className={"font-normal"}>Home</SidebarLabel>
              </Sidebar_item>
              
              <Sidebar_item href={"/dashboard/agents"} path={"/dashboard/agents"}>
                <Bot strokeWidth={path === '/dashboard/agents' ? 1.75 : 1.25} size={18} />
                <SidebarLabel className={"font-normal"}>Agents</SidebarLabel>
              </Sidebar_item>

              <Sidebar_item href={"/dashboard/teams"} path={"/dashboard/teams"}>
                <Users strokeWidth={path === '/dashboard/teams' ? 1.75 : 1.25} size={18} />
                <SidebarLabel className={"font-normal"}>Teams</SidebarLabel>
              </Sidebar_item>

              <Sidebar_item href={"/dashboard/channels"} path={"/dashboard/channels"}>
                <Rss strokeWidth={path === '/dashboard/channels' ? 1.75 : 1.25} size={18} />
                <SidebarLabel className={"font-normal"}>Channels</SidebarLabel>
              </Sidebar_item>

              <Sidebar_item href={"/dashboard/tasks"} path={"/dashboard/tasks"}>
                <ListCheckIcon strokeWidth={path === '/dashboard/tasks' ? 1.75 : 1.25} size={18} />
                <SidebarLabel className={"font-normal"}>Tasks</SidebarLabel>
              </Sidebar_item>

              <Sidebar_item href={"/dashboard/filesystem"} path={"/dashboard/filesystem"}>
                <DatabaseZap strokeWidth={path === '/dashboard/filesystem' ? 1.75 : 1.25} size={18} />
                <SidebarLabel className={"font-normal"}>Filesystem</SidebarLabel>
              </Sidebar_item>  
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Tasks</SidebarHeading>
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
                <SidebarLabel className={"font-normal"}>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/dashboard/playground">
                <Sparkles size={20} strokeWidth={1.25} />
                <SidebarLabel className={"font-normal"}>playground</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
    )
}