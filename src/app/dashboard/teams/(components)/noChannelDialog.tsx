import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function NoChannelDialog({isItOpen}) {
  const [open, setOpen] = React.useState(isItOpen)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
        
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You don't own any channels</AlertDialogTitle>
            <AlertDialogDescription>
              You need to create a channel before you can create your temas, agents or tasks. Create one now, clicking the button below
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
                <Link href="/dashboard/channels/new">
                    Create channel
                </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Attention</DrawerTitle>
          <DrawerDescription>
          You need to create a channel before you can create your temas, agents or tasks. Create one now, clicking the button below
          </DrawerDescription>
        </DrawerHeader>
        
        <DrawerFooter className="pt-2">
            <DrawerClose asChild>
                <Button asChild>
                    <Link href="/dashboard/channels/new">
                        Create channel
                    </Link>
                </Button>
            </DrawerClose>
            <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
            </DrawerClose>
          
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}


