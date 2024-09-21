'use client' // is needed only if you’re using React Server Components
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
import { uploadAvatar } from "@/server-actions/avatar-uploader"
import { useToast } from "@/components/ui/use-toast"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { useState } from 'react';
  
  const pubKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

  export function AvatarPage() {
    
    const { toast } = useToast()
    const uploadAvatarFn = async(e) => {
      if (e?.allEntries[0].status === "success") {
        const upload_status = await uploadAvatar(e?.allEntries[0].uuid)
        console.log("UPLOADED : ", upload_status)
        console.log("FILE UUID: ", e.allEntries[0])
        if (upload_status?.status === 'Success') {
          localStorage.setItem('avatar-uuid', e.allEntries[0].uuid)
          toast({
            title: "File uploaded successfully",
            description: `Please, refresh the page to see results.`,
          })
        } else if (upload_status?.status === 'Failure') {
          toast({
            title: "Something went wrong",
            description: `Please, try again later`,
          })
        }
      }
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <Avatar  className="h-20 w-20">
                <AvatarImage src={`https://ucarecdn.com/${localStorage.getItem('avatar-uuid')}/-/crop/face/1:1/`} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
                <FileUploaderRegular
                    pubkey={pubKey}
                    onChange={uploadAvatarFn}
                    maxLocalFileSizeBytes={1000000000}
                    multiple={false}
                    imgOnly={true}
                    sourceList="local, url, camera, dropbox"
                    classNameUploader="my-config"
                />
            </div>
        </div>
    )
  }
  