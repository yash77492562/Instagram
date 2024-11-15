import { NextRequest, NextResponse } from "next/server";
import { follower_relationship_status } from "../../graph_database_query/graph_database";

export async function POST(req:NextRequest,res:NextResponse) {
    try{
        const body = await req.json();
        const {userId} = body;
        const relationship_status = await follower_relationship_status(userId)
        if(relationship_status){
            return NextResponse.json({success:true ,data:relationship_status},{status:200})
        }else{
            return NextResponse.json({successs:false},{status:500})
        }
    }catch(error){
        return NextResponse.json({message:"Error while making relationship"})
    }
}