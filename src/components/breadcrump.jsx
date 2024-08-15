'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BreadCrumpComponent() {
    const path = usePathname()

    const links = path.split("/")

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {links.map((segment, index) => {
                    if (segment && index < links.length - 1) {
                        return <>
                        <BreadcrumbItem key={index}>
                            <BreadcrumbLink asChild>
                                <Link href={`/${segment}`}>{segment}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </>
                    }
                })}
              <BreadcrumbItem>
                <BreadcrumbPage>{links[links.length - 1]}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
    )

}