"use server";
import prisma from '@/lib/prisma'


export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) return user
        return null
    } catch {
        return null;
    }
}

export const getUserById = async (id: string | undefined) => {
    try {
        const user = await prisma.user.findUnique({ where: { user_id : id } });
        if (user) return user;
    } catch {
        return null;
    }
}