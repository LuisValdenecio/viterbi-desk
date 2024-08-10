import { NextResponse } from "next/server"
import { google } from "googleapis"
//const credentials = require('./google_credentials.json')
import {getToken,decode} from 'next-auth/jwt'


export const GET = async (req, res) => {

        const secret = process.env.AUTH_SECRET
        const token = await getToken({ req, secret })
        
        const access_token = token?.['access_token']
        const refresh_token = token?.['refresh_token']
        
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          'http://localhost:3000/api/auth/callback/google'
        );

        oauth2Client.setCredentials({
          access_token,
          refresh_token
        });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        try {

          const messages = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
          });
      
          const messageDetailsPromises = messages.data.messages.map((message) =>
            gmail.users.messages.get({ userId: 'me', id: message.id })
          );
      
          const messageDetails = await Promise.all(messageDetailsPromises);
      
          console.log(messageDetails)

        

        return new NextResponse("success", {
          status : 201
        })
           

    } catch(e) {
        console.log(e)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
    
   

        
}