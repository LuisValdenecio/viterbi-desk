import { NextResponse } from "next/server"
import {google} from 'googleapis';
import crypto from 'crypto'

export const GET = async (req, res) => {

    const scopes = [
        'https://mail.google.com/', // Add any other scopes you need
    ];
    
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/api/gmail-consent-response'
    );

    //const state = crypto.randomBytes(32).toString('hex');

    const authUrl = auth.generateAuthUrl({
        access_type: 'offline', // Will return a refresh token
        scope: scopes, // Array of scopes
        prompt: 'consent', // Forces the consent screen to show every time
        //state : state
    });

    return Response.json(authUrl)

    return new NextResponse("success", {
        status : 201,
        authUrl : authUrl
    })
}