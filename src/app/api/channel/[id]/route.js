import { NextResponse } from "next/server"
import ChannelModel from "@/lib/mongo/channels";
import connect from "@/lib/mongo";

export const GET = async (req, { params }) => {
    try {
        await connect()
        const channel = await ChannelModel.findOne({_id : params.id})
        
        return Response.json({ channel })

    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}