import { NextResponse } from "next/server"
import {google} from 'googleapis';
import axios from "axios";


export const GET = async(req, res) => {
    
    //console.log(req)
    const scopes = [
        'https://mail.google.com/', // Add any other scopes you need
    ];

    //let params = {id : ''};
    
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/api/gmail-consent-response'
    );

    const authUrl = auth.generateAuthUrl({
        access_type: 'offline', // Will return a refresh token
        scope: scopes, // Array of scopes
        prompt: 'consent', // Forces the consent screen to show every time
        //state : params.id
    });

    return NextResponse.redirect(authUrl)

    /*
    await NextResponse.redirect(authUrl)
    return Response.json({})
    */
}

