import { NextResponse } from "next/server"
import { createUser } from "@/server-actions/users"
import bcrypt from "bcrypt"

export const POST = async (request) => {
    const {name, email, password} = await request.json()

    const hashedPassword = await bcrypt.hash(password, 5)
    const newUser = {
        name,
        password: hashedPassword,
        email
    }

    try {
        createUser(newUser)
    } catch(e) {
        return new NextResponse("User has been created", {
            status : 500
        })
    }
    
    return new NextResponse("User has been created", {
        status : 201
    })
}