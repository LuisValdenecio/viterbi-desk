
import { Avatar } from '@/components/avatar'
import { getEvents } from '@/data'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import { SiderBarBody } from './(components)/sidebar-body'

import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleStackIcon,
  Cog8ToothIcon,
  DocumentTextIcon,
  EyeIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/16/solid'

import { House, ContactRound, Bot, DatabaseZap, Settings, PencilRuler, Inbox, Search, CircleHelp, Sparkles, CircleUser, Lightbulb, ShieldCheck, LogOut, Eye } from 'lucide-react'

import {
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { doLogout } from '@/server-actions/authentication'
import { getChannles } from '@/server-actions/channels'
//import { usePathname } from 'next/navigation'
//import { useEffect, useState } from 'react'

const events = [
  {
    id: 1000,
    name: 'Bear Hug: Live in Concert',
    url: '/events/1000',
    date: 'May 20, 2024',
    time: '10 PM',
    location: 'Harmony Theater, Winnipeg, MB',
    totalRevenue: '$102,552',
    totalRevenueChange: '+3.2%',
    ticketsAvailable: 500,
    ticketsSold: 350,
    ticketsSoldChange: '+8.1%',
    pageViews: '24,300',
    pageViewsChange: '-0.75%',
    status: 'On Sale',
    imgUrl: '/events/bear-hug.jpg',
    thumbUrl: '/events/bear-hug-thumb.jpg',
  },
  {
    id: 1001,
    name: 'Six Fingers — DJ Set',
    url: '/events/1001',
    date: 'Jun 2, 2024',
    time: '8 PM',
    location: 'Moonbeam Arena, Uxbridge, ON',
    totalRevenue: '$24,115',
    totalRevenueChange: '+3.2%',
    ticketsAvailable: 150,
    ticketsSold: 72,
    ticketsSoldChange: '+8.1%',
    pageViews: '57,544',
    pageViewsChange: '-2.5%',
    status: 'On Sale',
    imgUrl: '/events/six-fingers.jpg',
    thumbUrl: '/events/six-fingers-thumb.jpg',
  },
  {
    id: 1002,
    name: 'We All Look The Same',
    url: '/events/1002',
    date: 'Aug 5, 2024',
    time: '4 PM',
    location: 'Electric Coliseum, New York, NY',
    totalRevenue: '$40,598',
    totalRevenueChange: '+3.2%',
    ticketsAvailable: 275,
    ticketsSold: 275,
    ticketsSoldChange: '+8.1%',
    pageViews: '122,122',
    pageViewsChange: '-8.0%',
    status: 'Closed',
    imgUrl: '/events/we-all-look-the-same.jpg',
    thumbUrl: '/events/we-all-look-the-same-thumb.jpg',
  },
  {
    id: 1003,
    name: 'Viking People',
    url: '/events/1003',
    date: 'Dec 31, 2024',
    time: '8 PM',
    location: 'Tapestry Hall, Cambridge, ON',
    totalRevenue: '$3,552',
    totalRevenueChange: '+3.2%',
    ticketsAvailable: 40,
    ticketsSold: 6,
    ticketsSoldChange: '+8.1%',
    pageViews: '9,000',
    pageViewsChange: '-0.15%',
    status: 'On Sale',
    imgUrl: '/events/viking-people.jpg',
    thumbUrl: '/events/viking-people-thumb.jpg',
  },
]

function AccountDropdownMenu({ anchor }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="/dashboard/account">
        <CircleUser size={20} strokeWidth={1.25} />
        <DropdownLabel className="ml-2"> My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheck size={20} strokeWidth={1.25} />
        <DropdownLabel className="ml-2">Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <Lightbulb size={20} strokeWidth={1.25} />
        <DropdownLabel className="ml-2">Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem>
        <LogOut size={20} strokeWidth={1.25} />
        <DropdownLabel className="ml-2">
          <form action={doLogout}>
            <button type='submit'>Sign out</button>
          </form>  
        </DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export default async function ApplicationLayout({ children }) {
  
  const session = await auth()
  const channels = await getChannles()
  console.log("SESSION: ", session)
  
  if (!session?.user) redirect("/signin")

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
              <NavbarItem href="/search" aria-label="Search">
                <MagnifyingGlassIcon />
              </NavbarItem>
              <NavbarItem href="/inbox" aria-label="Inbox">
                <Inbox strokeWidth={1} size={20} />
              </NavbarItem>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src={session?.user?.image} square />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                <Avatar src="/teams/catalyst.svg" />
                <SidebarLabel>Catalyst</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                {channels?.length >= 4 ? (
                  <>
                    <DropdownItem href="/dashboard/settings">
                      <Eye size={20} strokeWidth={1.25} />
                      <DropdownLabel className="ml-1">See all channels</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                  </>
                 
                ) : (<></>)}
                
                
                
                {channels?.map((channel) => (
                  <DropdownItem href="#">
                    {channel.provider === 'Gmail' ? (
                      <Avatar slot="icon" src="/teams/Gmail.svg" />
                    ) : (
                      channel.provider === 'Discord' ? (
                        <Avatar slot="icon" src="/teams/Discord.svg" />
                      ) : (
                        channel.provider === 'LinkedIn' ? (
                          <Avatar slot="icon" src="/teams/LinkedIn.svg" />
                        ) : (
                          <Avatar slot="icon" src="/teams/OtherSource.svg" />
                        )
                      )
                    )}
                   
                   
                    
                    <DropdownLabel>{channel.name}</DropdownLabel>
                  </DropdownItem>
                ))}
                
                <DropdownItem href="/dashboard/channels">
                  <PlusIcon />
                  <DropdownLabel>New Channel</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <SidebarSection className="max-lg:hidden">
              <SidebarItem href="/search">
                <Search strokeWidth={1.25} size={20} />
                <SidebarLabel>Search</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/inbox">
                <Inbox size={20} strokeWidth={1.25} />
                <SidebarLabel>Inbox</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>

          <SiderBarBody events={events} />

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar src={session?.user?.image} className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{session?.user?.name}</span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {session?.user?.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
