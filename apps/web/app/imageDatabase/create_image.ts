import { encrypt } from "@repo/encrypt/client";
import { prisma } from "@repo/prisma_database/client"
type image={
    display_name:string;
    tags:string[];
    userId:string;
    secure_url:string;
    public_id :string;
    resource_type:string
}
export const image_create = async ({display_name,tags,secure_url,public_id,userId,resource_type}:image)=>{
    try{
        const encrypt_display_name = encrypt(display_name)
        const encrypt_secure_url = encrypt(secure_url)
        const encrypt_public_id = encrypt(public_id)
        const encrypt_resource_type = encrypt(resource_type)
        const image = await prisma.image.create({
            data:{
                display_name:encrypt_display_name,
                tags,
                userId,
                secure_url:encrypt_secure_url,
                resource_type:encrypt_resource_type,
                public_id:encrypt_public_id
            }
        });
        if(!image){
            console.log('image details can not be stored')
            return false
        }
        return true
    }catch(error){
        console.log(error,'Error while connecting to the database or image table')
        return 'Unable to connect to server'
    }

}