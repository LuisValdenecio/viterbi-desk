import { NextResponse } from "next/server"
import TaskModel from "@/lib/mongo/tasks"
import connect from "@/lib/mongo";

export const GET = async (req, { params }) => {
    try {
        await connect()
        const tasks = await TaskModel.find({agent : params.id})
        
        return Response.json({ tasks })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}