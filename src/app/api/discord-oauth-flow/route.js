import { NextResponse } from "next/server"
import axios from "axios";
import url from 'url'

export const GET = async(req, res) => {
    let q = url.parse(req.url, true).query;
    let oAuth_link = q.read_access
    
    if (q.read_and_write_access) {
        oAuth_link = q.read_and_write_access
    }

    if (q.full_access) {
        oAuth_link = q.full_access
    }

    console.log("LINK: ", oAuth_link)

    const response = NextResponse.redirect(oAuth_link)   
    return response
}

