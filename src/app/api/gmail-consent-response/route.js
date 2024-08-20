import { NextResponse } from "next/server"
import {google} from 'googleapis';
import crypto from 'crypto'
import ChannelModel from "@/lib/mongo/channels";
import connect from "@/lib/mongo";
import url from 'url'

const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/api/gmail-consent-response'
);

export const GET = async (req, res) => {

    let q = url.parse(req.url, true).query;

    if (q.error) { // An error response e.g. error=access_denied
        return new NextResponse("something bad happened", {
            status : 500
        })
    }  else { // Get access and refresh tokens (if access_type is offline)
        let { tokens } = await auth.getToken(q.code);
        auth.setCredentials(tokens);
       
        await connect()
        const channel = await ChannelModel.findOne({_id : q.state})
        channel.refreshToken = tokens.refresh_token
        channel.save()

        return new NextResponse("success", {
            status : 201,
            tokens : tokens
        })
            
    }
}