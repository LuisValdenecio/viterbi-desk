'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export function CardHeader_({main_title, description}) {
    return (
        <CardHeader>
            <CardTitle>{main_title}</CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
        </CardHeader>           
    )
}