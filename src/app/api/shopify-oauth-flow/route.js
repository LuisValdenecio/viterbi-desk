import { NextResponse } from "next/server"
import axios from "axios";
import url from 'url'

export const GET = async(req, res) => {
    let q = url.parse(req.url, true).query;
    let oAuth_link = q.scope_access
    
    const response = NextResponse.redirect(oAuth_link)   
    return response
}

