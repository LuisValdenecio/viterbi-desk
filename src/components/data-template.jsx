'use client'

import Image from "next/image"

import Link from "next/link"
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import { BreadCrumpComponent } from '@/components/breadcrump'
import { CreateDataStorageDialog } from '../app/dashboard/filesystem/(components)/addFileDialog'

export function Dashboard({ children, cta_button, links, showSearch, showButtons, addDataStorage }) {


  return (
    <div className="flex flex-col">
      <div className="flex flex-col ">
        <header className="sticky mb-2 top-0 z-30 flex h-14 items-center gap-4 border-b bg-background  sm:static sm:h-auto sm:border-0 sm:bg-transparent ">
        
        <BreadCrumpComponent />

        {showSearch && (
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
        )}
          
        </header>
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          <Tabs defaultValue="0">
            <div className="flex items-center mb-2">
              <TabsList>
                {links.map((link, index) => {
                  return <Link href={link.href}>
                    <TabsTrigger TabsTrigger value={"" + index} >
                      {link.name}
                    </TabsTrigger>
                  </Link>

                })}

              </TabsList>
              {showButtons && (
                <div className="ml-auto flex items-center gap-2">
                  
                  <Button size="sm" variant="outline" className="h-8 gap-1" asChild>
                    <Link href={cta_button.href}>
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        {cta_button.name}
                      </span>
                    </Link>

                  </Button>
                </div>
              )}

              {addDataStorage && (
                <div className="ml-auto flex items-center gap-2">
                  <CreateDataStorageDialog />
                </div>
              )}
              
            </div>

            
              {children}
            

          </Tabs>
        </main>
      </div>
    </div>
  )
}
