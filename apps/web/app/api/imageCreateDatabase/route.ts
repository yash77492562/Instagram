import { NextRequest, NextResponse } from 'next/server';
import { image_create } from '../../imageDatabase/create_image';
interface Request {
    public_id: string;                  
    display_name:string;
    tags:string[];
    resource_type:string
    secure_url: string;
    userId?:string 
  }
// POST request handler
export async function POST(req:NextRequest,res:NextResponse) {
  try {
    const body = await  req.json()
    const {display_name,userId,public_id,resource_type,tags,secure_url}:Request = body
    if(userId === undefined){
        return NextResponse.json({success:false,message:'userId not found'},{status:500})
    }
    const imageCreate = await  image_create({display_name,userId,public_id,resource_type,tags,secure_url})
    if(!imageCreate){
        return NextResponse.json({
            success:false,message:'problem while loading your data to databse'
        },{
            status:500
        })
    }
    // Respond with the generated caption
    return NextResponse.json({success:true},{status:200});
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ message: 'Failed to load data' }, { status: 500 });
  }
}