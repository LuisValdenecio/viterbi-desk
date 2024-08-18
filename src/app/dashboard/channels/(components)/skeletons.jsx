import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Skeleton } from "@/components/ui/skeleton"
import { CardHeader_ } from '@/components/cardHeader'
import { CardFooter_ } from '@/components/cardFooter'
import { CardContent_ } from '@/components/cardContent'

export function Skeleton_() {
  return (
    <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[70px]" />
              </TableHead>
              
              <TableHead className="hidden md:table-cell">
                <Skeleton className="h-4 w-[60px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[60px]" />
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {[1,2,3,4,5,6,7,8].map((channel, index) => (
            <TableRow key={index}>
                <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-[32px] w-[32px] rounded-xl" />
                </TableCell>
                <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[90px]" />
                </TableCell>
                <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[70px]" />
                </TableCell>
                <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[90px]" />
                </TableCell>
                <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[90px]" />
                </TableCell>
            </TableRow>
          ))}
          </TableBody>
          </Table>
         
    </>
  
    )
}