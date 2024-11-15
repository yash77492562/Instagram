import  CredentialsProvider  from "next-auth/providers/credentials";
import {User as NextAuthUser,Session as NextAuthSession} from "next-auth";
import *  as argon2   from "argon2";
import {prisma} from '@repo/prisma_database/client';
import {  check_username_details } from "../database/details_check/user_authincate";
import {encrypt} from "@repo/encrypt/client";
import   {JWT} from "next-auth/jwt";
import { generateSecureTokenWithSalt } from "../backend/generate_token";
import { create_userNode_graph } from "../graph_database_query/graph_database";

export const authOptions = {
    providers:[
        CredentialsProvider({
            name:'',
            credentials:{
                username: { label: "Username", type: "text", placeholder: "john Smith", required: true },
                phone: { label: "PhoneNo", type: "tel", placeholder: "1234567899", required: true },
                password: { label: "Password", type: "password", required: true },
                email: { label: "Email", type: "email", placeholder: "example@gmail.com", required: true }
            },
            async authorize(credentials): Promise<NextAuthUser | null> {
                try {
                    if (!credentials) {
                        console.error("Credentials are not provided");
                        return null;
                    }
            
                    const { username, email, password, phone } = credentials;
                    console.log(credentials)
                    let User_details;
            
                    // Check if user exists
                    const existingUser = await check_username_details({ username});
            
                    if (!existingUser) {
                        // Create new user
                        const hashedPassword = await argon2.hash(password, {
                            type: argon2.argon2id,
                            memoryCost: 65536, // 64MB
                            timeCost: 3,
                            parallelism: 4,
                        });
                        const encryptEmail = encrypt(email);
                        const encryptUsername = encrypt(username);
                        const encryptPhone = encrypt(phone);
                        const Usertoken = generateSecureTokenWithSalt(username)
                        const Emailtoken = generateSecureTokenWithSalt(email)
                        const Phonetoken = generateSecureTokenWithSalt(password)
            
                        try {
                            const transactionResult = await prisma.$transaction(async (tx) => {
                                const newUser = await tx.user.create({
                                    data: {
                                        username: encryptUsername,
                                        password: hashedPassword,
                                        email: encryptEmail,
                                        phone: encryptPhone,
                                        tags:['GAMES']
                                    },
                                });
                                await tx.username_token.create({
                                    data:{
                                        token:Usertoken,
                                        userId:newUser.id
                                    }
                                })
                                await tx.email_token.create({
                                    data:{
                                        token:Emailtoken,
                                        userId:newUser.id
                                    }
                                })
                                await tx.phone_token.create({
                                    data:{
                                        token:Phonetoken,
                                        userId:newUser.id
                                    }
                                })
                                const result = await create_userNode_graph(newUser.id)
                                return newUser;
                            });
                            User_details = transactionResult;
                            return {
                                id: User_details.id,
                                name: User_details.username,
                            };
                        } catch (error) {
                            console.error('Database Connection break', error);
                            return null;
                        }
                    } else {
                        // Validate existing user
                        const isValidPassword = await argon2.verify(
                            existingUser.user.password,
                            password
                        );
                        if (!isValidPassword) {
                            console.error('Password incorrect. Please enter the correct password.');
                            return null;
                        }
                        return {
                            id: existingUser.user.id,
                            name: existingUser.user.username,
                        };
                    }
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
            
          })
        ],
        secret: process.env.JWT_SECRET,
        callbacks: {
          async session({ session, token }: { session: NextAuthSession; token: JWT }) {
            if (token && session.user) {
              session.user.id = token.sub!;
            }
            return session;
          }
        }
    };