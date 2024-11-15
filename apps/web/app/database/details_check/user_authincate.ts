import { prisma } from "@repo/prisma_database/client";
import { decrypt } from "@repo/encrypt/client";
import { generateSecureTokenWithSalt } from "../../backend/generate_token";

interface User{
    username:string
}

export const check_username_details = async ({username}:User)=>{
    try{
        const token = generateSecureTokenWithSalt(username)
        const userExist = await prisma.username_token.findFirst({
            where:{
                token
            },
            select:{
                user:true
            }
        })
        if(!userExist){
            return false
        }
        return userExist
    }catch(error){
        console.error(error)
        throw new Error('UserName Exist')
    }
}
export const check_emailtoken_details = async ({email}:{email:string})=>{
    try{
        const token = generateSecureTokenWithSalt(email)
        const emailExist = await prisma.email_token.findFirst({
            where:{
                token
            }
        })
        if(!emailExist){
            return false
        }
        return emailExist
    }catch(error){
        console.error(error)
        throw new Error('UserName Exist')
    }
}


export const check_phonetoken_details = async ({phone}:{phone:string})=>{
    try{
        const token = generateSecureTokenWithSalt(phone)
        const phoneExist = await prisma.username_token.findFirst({
            where:{
                token
            }
        })
        if(!phoneExist){
            return false
        }
        return phoneExist
    }catch(error){
        console.error(error)
        throw new Error('UserName Exist')
    }
}

