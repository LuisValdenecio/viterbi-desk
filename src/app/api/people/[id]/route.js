import { NextResponse } from "next/server"

import prisma from "@/lib/prisma";

export const GET = async (req, { params }) => {
    try {

        const people = await prisma.user.findMany({
            relationLoadStrategy: 'join',
            
            include: {
                user_privilege: {
                   
                },
            },
        })

        //const people = await prisma.user_privilege.findMany()
        return Response.json({ people })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}