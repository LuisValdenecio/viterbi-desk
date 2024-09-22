'use client'

import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';
import  MemberSummary  from './(summary)/page';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Member } from '../(components)/member';



export default function layout({ children }) {

  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <div className='flex flex-col gap-4'>
        <div className="flex gap-4 items-center">
            <Member  />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Tabs defaultValue="summary">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="summary" >
            <MemberSummary />
          </TabsContent>
         
          <TabsContent value="agents">
            <h1>agents</h1>
          </TabsContent>

          <TabsContent value="teams">
            <h1>teams</h1>
          </TabsContent>

          <TabsContent value="tasks">
            <h1>tasks</h1>
          </TabsContent>

        </Tabs>
      </div>
      
    </div>
  );
};


