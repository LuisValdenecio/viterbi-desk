import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import prisma from "./lib/prisma";
import authConfig from "../auth.config";

async function getUser(email) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        return user
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
}
  
export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    session: {
      strategy: 'jwt',
    },
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (credentials === null) return null;
                
                try {
                    const user = await getUser(credentials?.email);
                    
                    if (user) {
                        const isMatch = await bcrypt.compare(
                            credentials?.password,
                            user.password
                        )

                        if (isMatch) {
                            return user
                        } else {
                            console.log("error")
                            throw new Error("Password is not correct");
                        }
                    } else {
                        throw new Error("User not found");
                    }
                } catch (error) {
                    throw new Error(error);
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    scope: [
                        "openid",
                        "https://www.googleapis.com/auth/userinfo.email",
                        "https://www.googleapis.com/auth/userinfo.profile",
                        "https://www.googleapis.com/auth/gmail.readonly"
                    ].join(" "),
                    response_type: "code",
                },
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        session: ({session, token}) => {
            return {
                ...session,
                user : {
                    ...session.user,
                    id : token.id,
                    img : token.img
                }
            }
        },

        jwt: ({token, user}) => {
            if (user) {
                return {
                    ...token, 
                    id : user.user_id,
                    email : user.email,
                    img : user.img
                }
            }
            return token
        }
    },
    ...authConfig,
})