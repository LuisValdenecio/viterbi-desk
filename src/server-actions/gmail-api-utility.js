'use server'

import {google} from 'googleapis';
import crypto from 'crypto'


const scopes = [
    'https://mail.google.com/', // Add any other scopes you need
];
  
const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/api/auth/callback/google'
);

const state = crypto.randomBytes(32).toString('hex');

const authUrl = auth.generateAuthUrl({
    access_type: 'offline', // Will return a refresh token
    scope: scopes, // Array of scopes
    prompt: 'consent', // Forces the consent screen to show every time
    state : state
});

export async function getURL() {
    return authUrl
}

/*
// Load token or redirect to auth URL
auth.setCredentials({refresh_token : process.env.GOOGLE_REFRESH_TOKEN});

// Create Gmail client
const gmail = google.gmail({version: 'v1', auth});

export async function GetEmails() {

    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10
        });
       
        const messageDetailsPromises = res.data.messages.map((message) =>
            gmail.users.messages.get({ userId: 'me', id: message.id })
          );
      
          const messageDetails = await Promise.all(messageDetailsPromises);

          messageDetails.map((msg) => {
            console.log("PAYLOAD: ", msg.data.snippet)
          })
      
          //console.log("DETAILS ", messageDetails)

            
    
        return messages
    } catch (error) {
        console.log(error)
    }
}
    */