import { prisma } from "@repo/prisma_database/client";
import { getUserId } from "../../userId/userID"

export const userDetails = async ()=>{
    const userId = await getUserId();
    console.log(userId)
    try{
        const userInfo = await prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!userInfo){
            console.log('no user find with this user id',userId)
            return null
        }
        console.log(userInfo)
        return userInfo
    }catch(error){
        console.log(error,'error while getting the user')
        return "Couldn't connect database right now"
    }
}