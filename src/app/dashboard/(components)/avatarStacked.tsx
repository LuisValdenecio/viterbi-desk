import Image from "next/image";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

export default function AvatarsStacked({members}) {
    return (
      <div className="flex gap-1">
        <div className="flex -space-x-1 overflow-hidden cursor-pointer">
            {members.slice(0,4).map((item, index) => (
                <Avatar key={index} className="inline-block h-6 w-6 rounded-full ring-1 ring-white">
                    <AvatarImage src="" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ))}
            
        </div>
        <div>
            <span>{members.length} {members.length == 1 ? (<span>member</span>) : (<span>members</span>)}</span>
        </div>
      </div>
    )
  }
  