import { NextResponse } from "next/server"
import  PersonModel  from "@/lib/mongo/person"
import connect from "@/lib/mongo";

export const GET = async (req, { params }) => {
    try {
        await connect()
        const people = await PersonModel.find({team : {$all : [params.id]}})
        return Response.json({ people })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}