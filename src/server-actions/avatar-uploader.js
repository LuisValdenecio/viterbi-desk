'use server'
import prisma from "@/lib/prisma";
import { auth } from '@/auth'

export async function uploadAvatar(img_code) {
    const session = await auth()
    try {

        const uploaded_user = await prisma.user.update({
            where : {
                user_id : session?.user?.id
            },
            data : {
                img : img_code
            }
        })

        console.log("UPDATED USER: ", uploaded_user)

        if (uploaded_user) {
            return {
                status : 'Success'
            }
        } 

        return {
            status : 'Failure'
        }

    } catch (error) {
        console.log(error)
    }
}