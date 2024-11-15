import { prisma } from "@repo/prisma_database/client"
import { getUserId } from "../userId/userID"

export const gettingAllUser = async ()=>{
    const tags = "GAMES"
    const userId = await getUserId()
    try{
        const allUser = await prisma.user.findMany({
            where:{
                tags:{
                    has:tags
                },
                NOT:{
                    id:userId
                }
            },
            take:10
        })
        console.log(allUser,'allUser')
        return allUser
    }catch(error){
        return error
    }
}