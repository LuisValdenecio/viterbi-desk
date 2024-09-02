import { NextResponse } from "next/server"
import {google} from 'googleapis';
import prisma from "@/lib/prisma";
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

        const new_google_token = await prisma.google_token.create({
            data : {
                access_token : tokens?.access_token,
                refresh_token : tokens?.refresh_token,
                scope : tokens?.scope
            }
        })

        const response = NextResponse.redirect(`http://localhost:3000/dashboard/channels/new?provider=Gmail-${new_google_token.id}`)
       
        return response            
    }
}