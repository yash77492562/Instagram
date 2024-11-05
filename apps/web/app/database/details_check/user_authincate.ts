import { prisma } from "@repo/prisma_database/client";

export const check_username_details = async ({username}:{username:string})=>{
    try{
        const userExist = await prisma.user.findUnique({
            where:{
                usernme:username
            }
        })
        if(!userExist){
            return false
            console.error('User not found')
        }else{
            return userExist
        }
    }catch(error){
        console.error(error)
    }
}