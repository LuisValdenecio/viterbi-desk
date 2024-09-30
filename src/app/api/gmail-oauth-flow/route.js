import { NextResponse } from "next/server"
import {google} from 'googleapis';
import axios from "axios";
import url from 'url'

export const GET = async(req, res) => {
    let q = url.parse(req.url, true).query;
    let scopes = [q.read_access]
    
    if (q.read_and_write_access) {
        scopes.pop()
        scopes.push(q.read_and_write_access)
    }

    if (q.full_access) {
        scopes.pop()
        scopes.push(q.full_access)
    }

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

