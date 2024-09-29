import { NextResponse } from "next/server"
import axios from 'axios'
import prisma from "@/lib/prisma";
import url from 'url'

export const GET = async (req, res) => {

    const code = url.parse(req.url, true).query.code;
    if (code) { // An error response e.g. error=access_denied
        console.log("GOT A CODE: ", code)

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID);
        params.append('client_secret', process.env.HUBSPOT_CLIENT_SECRET);
        params.append('redirect_uri', process.env.NEXT_PUBLIC_HUBSPOT_REDIRECT_URL);
        params.append('code', code);
        
        const token =await axios.post('https://api.hubapi.com/oauth/v1/token', params)
        const { refresh_token, access_token, expires_in }= token.data;
       

        console.log("AUTH TOKEN: ", access_token)

    }  else { // Get access and refresh tokens (if access_type is offline)
        
        
    }
    const response = NextResponse.redirect(`http://localhost:3000/dashboard/teams?provider=bubspot`)
    return response            
}