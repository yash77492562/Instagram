import { NextResponse } from "next/server";
import { gettingAllUser } from "../../backend/gettingAllUser";

export async function GET() {
    try{
        const allUser = await gettingAllUser()
        if(allUser){
            return NextResponse.json({success:true ,data:allUser},{status:200})
        }else{
            return NextResponse.json({successs:false},{status:500})
        }
    }catch(error){
        return NextResponse.json({message:"Error while getting all ther user"})
    }
}