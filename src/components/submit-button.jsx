'use client'

import { Button } from "@/components/ui/button"
import {Loader2 } from "lucide-react"
import { Children } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitBtn({children}) {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : <span>{children}</span>}
      </Button>
    )
}