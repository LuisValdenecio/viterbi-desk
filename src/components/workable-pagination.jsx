'use client'

import {
    Pagination,
    PaginationGap,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
  } from '@/components/pagination'
import { useSearchParams } from 'next/navigation';

export function Workable_Pagination({totalPagesArray, resourceURL}) {

    const searchParams = useSearchParams()
    const prevPage = parseInt(searchParams.get("page"), 10) - 1 > 0 ? parseInt(searchParams.get("page"), 10) - 1 : 1
    const nextPage = parseInt(searchParams.get("page"), 10) + 1

    const search = searchParams.get('search')

    if (totalPagesArray.length <= 6) {
        return <>
        <Pagination className="mt-10">
              {parseInt(searchParams.get("page"), 10) > 1 ? (
                <PaginationPrevious  href={{ 
                  pathname: resourceURL,
                  query : {
                    ...(search ? {search} : {}),
                    page : prevPage
                  }
                 }} />
              ) : (<PaginationPrevious/>)}
              
              <PaginationList>
                {totalPagesArray.map((page_ele, index) => (
    
                    <PaginationPage 
                      href={{ 
                        pathname: resourceURL,
                        query : {
                          ...(search ? {search} : {}),
                          page : page_ele
                        }
                      }}
                    current={searchParams.get("page") == page_ele}
                        >{page_ele}</PaginationPage>   
                ))}
              </PaginationList>
    
              {parseInt(searchParams.get("page"), 10) < totalPagesArray.length ? (
                <PaginationNext href={{ 
                  pathname: resourceURL,
                  query : {
                    ...(search ? {search} : {}),
                    page : nextPage
                  }
                 }} />
              ) : (<PaginationNext/>)}
    
              
          </Pagination>
        
        </>;
    } else {
        return <>
            <span>think about cases with 6 or more pages</span>
        </>
    }


}