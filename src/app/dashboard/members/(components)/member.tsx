'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation';

export function Member() {
    const searchParams = useSearchParams()
    return (
        <>
            <Avatar className="h-20 w-20">
                <AvatarImage src={`https://ucarecdn.com/${searchParams.get('img')}/-/crop/face/1:1/`} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <h2 className="text-2xl font-semibold ">{searchParams.get('name')?.toString()}</h2>
                <span className="text-sm text-gray-500">{searchParams.get('email')?.toString()}</span> 
                <span className="text-sm text-gray-500">{searchParams.get('role')?.toString()}</span>
            </div>
        </>
    )
}