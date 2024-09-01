import { NextResponse } from "next/server"
import ChannelModel from "@/lib/mongo/channels";
import connect from "@/lib/mongo";

export const GET = async (req, res) => {
    try {
        await connect()
        const channels = await ChannelModel.find({}, { name : 1 })
        
        return Response.json({ channels })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}