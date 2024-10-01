'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function setTabsToFalse(tabs) {
    let working_tabs = tabs
    working_tabs.map(tab => tab.current = false)
    return working_tabs
}

export default function Tabs() {
    
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const taskId = pathname.split("/")[3]
    const resource = pathname.split("/")[pathname.split("/").length - 1]
    let newTabs

    const tabs = [
        { name: 'Overview', href: `/dashboard/tasks/${taskId}`, current: true },
        { name: 'History', href: `/dashboard/tasks/${taskId}/history`, current: false },
        { name: 'Settings', href: `/dashboard/tasks/${taskId}/settings`, current: false },
        { name: 'Reports', href: `/dashboard/tasks/${taskId}/reports`, current: false },
    ]

    const [tabsObject, setTabsObject] = useState(tabs)

    console.log("SEARCH PARAMS: ", resource)


    useEffect(() => {

        switch(resource) {
            case `${taskId}`:
                newTabs = setTabsToFalse(tabs)
                newTabs[0].current = true
                setTabsObject(newTabs)
                break
            case 'history':
                newTabs = setTabsToFalse(tabs)
                newTabs[1].current = true
                setTabsObject(newTabs)
                break
            case 'settings':
                newTabs = setTabsToFalse(tabs)
                newTabs[2].current = true
                setTabsObject(newTabs)
                break
            case 'reports':
                newTabs = setTabsToFalse(tabs)
                newTabs[3].current = true
                setTabsObject(newTabs)
                break
            default :
                break
        }
    }, [pathname])

    return (
        <div>
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                    id="tabs"
                    name="tabs"
                    defaultValue={tabs.find((tab) => tab.current).name}
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                    {tabsObject.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="inline-block">
                    <nav aria-label="Tabs" className="flex p-1 mt-4 space-x-2 border rounded-md">
                        {tabsObject.map((tab) => (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                aria-current={tab.current ? 'page' : undefined}
                                className={classNames(
                                    tab.current ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                                    'rounded-md px-2 py-2 text-xs font-medium',
                                )}
                            >
                                {tab.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
