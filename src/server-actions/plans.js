'use server'

import prisma from "@/lib/prisma"
import { auth } from '@/auth'

export async function getUserPlan() {
    const session = await auth()
    try {
        const user = await prisma.user.findUnique({
            where : {
                user_id : session?.user?.id,
            },
            include : {
                Stripe_sub : {
                    select : {
                        plan : true,
                        period : true
                    }
                },
            }
        })

        console.log("USER FOUND: ", user)

        const filtered_results = {
          plan : user.plan,
          period : user.Stripe_sub.period
        }

        return filtered_results
    } catch (error) {
        console.log(error)
    }
}