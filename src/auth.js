import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import UserModel from "./lib/mongo/users";
import bcrypt from "bcrypt"

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
                    const user = await UserModel.findOne({
                        email : credentials?.email
                    });
                    
                    if (user) {
                        const isMatch = await bcrypt.compare(
                            credentials?.password,
                            user.password
                        )

                        if (isMatch) {
                            return user;
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
        

        async jwt({ token, user, account }) {
            console.log("ACCOUNT :", account)
            console.log("PROVIDER : ", account?.provider)
            if (account?.['access_token']) {
                token['access_token'] = account?.['access_token'] || 'luis token' 
                token['refresh_token'] = account?.['refresh_token'] || 'luis refresh token'
                } else {
                    token['access_token'] = account?.['access_token'] || 'luis token' 
                token['refresh_token'] = account?.['refresh_token'] || 'luis refresh token'
                }
            return token;
        },
    },
})