import dbConnect from "@/lib/mongo/index"

export async function register() {
    await dbConnect()
}