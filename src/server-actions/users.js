'use server'

import User from "@/lib/mongo/users";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createUser(user) {
    try {   
        const newUser = await User.create(user)
        newUser.save()

    } catch(e) {
        throw new Error(e)
    }    
}