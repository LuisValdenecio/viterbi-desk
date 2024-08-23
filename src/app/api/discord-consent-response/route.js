import { NextResponse } from "next/server"
import {google} from 'googleapis';
import crypto from 'crypto'
import ChannelModel from "@/lib/mongo/channels";
import connect from "@/lib/mongo";
import url from 'url'
import axios from 'axios'

export const GET = async (req, res) => {
    let code = url.parse(req.url, true).query.code;
    const params = new URLSearchParams();
    let user;
    params.append('client_id', process.env.DISCORD_CLIENT_ID);
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', "http://localhost:3000/api/discord-consent-response");
    try{
        const response=await axios.post('https://discord.com/api/oauth2/token',params)
        const { access_token,token_type}=response.data;

        // find the discord channel and add access token
        await connect()
        const channel = await ChannelModel.findOne({provider : 'Discord'})
        channel.refreshToken = access_token
        channel.save()

        await axios.get("http://localhost:3000/dashboard/channels")

        return new NextResponse("success", {
            status : 201
        })


    } catch(error){
        console.log('Error',error)
    }
}

    