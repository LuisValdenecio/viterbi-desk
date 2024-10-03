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

export function capitalizeFirstLetter(str) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function BreadCrumpComponent({description}) {
    const path = usePathname()

    const links = path.split("/")

    return (
        <div>
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
          <h2 className="mt-1  text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {capitalizeFirstLetter(links[links.length - 1])}
          </h2>
          <p className="text-sm mb-4 font-semibold leading-7 text-indigo-600">{description}</p>
        </div>
    )

}