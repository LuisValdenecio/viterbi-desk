import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";

export const GET = async (req, { params }) => {
    try {
        const task = await prisma.task.findUnique({
            where : {
                task_id : params.id
            },
            include : {
                task_schedule : true
            }
        })

        const resultData = {
            name : task.name,
            priority : task.priority,
            status : task.status,
            timezone : task.task_schedule.timezone,
            day : task.task_schedule.day,
            taskScheduleId : task.task_schedule.id,
            dayPeriod : task.task_schedule.dayPeriod,
            hourAndMinute : task.task_schedule.hourAndMinute
        }
    
        return Response.json(resultData)

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}