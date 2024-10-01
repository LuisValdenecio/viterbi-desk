import { NextResponse } from "next/server"
import url from 'url'
import prisma from "@/lib/prisma";
import axios from 'axios'

export const GET = async (req, res) => {
    
    let code = url.parse(req.url, true).query;
    console.log("CODE : ", code)

    const params = new URLSearchParams();
    let user;
    params.append('client_id', process.env.DISCORD_CLIENT_ID);
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code.code);
    params.append('redirect_uri', process.env.DISCORD_REDIRECT_URI);
    try{
        //const tokenData = await axios.post('https://discord.com/api/oauth2/token',params)
        //const { access_token,token_type } = tokenData.data;
        
        

        const response = NextResponse.redirect(`http://localhost:3000/dashboard/channels/new?provider=Shopify-something`)
        return response
            
    } catch(error){
        console.log('Error',error)
    }

    const response = NextResponse.redirect(`http://localhost:3000/dashboard/channels/new?provider=Shopify-error`)
    return response
}

    