// 'use client'
// import { revalidatePath } from 'next/cache';
// import cloudinary from '../backend/cloudinaryConfig';
// import { CldImage } from 'next-cloudinary';

//  interface CloudinaryResource{
//     context?:{
//         alt?:string;
//         caption?:string;
//     };
//     public_id:string;
//     secure_url:string;
//  }
// async function Home() {
//     // search images 
//     const results = await cloudinary.search.expression('converse').execute()
//     const {resources:sneakers}= await cloudinary.api.resources_by_tag('nextjs-server-upload-sneaker',{})
//     async function create(formData:FormData) {
//         'use server';
//         console.log('created')
//         const file = formData.get('image') as File;
//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = new Uint8Array(arrayBuffer)
//         await new Promise((resolve,reject)=>{
//             cloudinary.uploader.upload_stream({
//                 tags:['nextjs-server-upload-sneaker']
//             },function (error,result){
//                 if(error){
//                     reject(error);
//                     return;
//                 }
//                 resolve(result)
//             }).end(buffer)
//         })
//         revalidatePath('/')
//     }
    
// }



// {/* <CldImage width='640' height='640' src='fjdkfj.jpg'
// alt='random src' sizes='(max-width:640px) 100vw , 
// (max-width:768px) 80vw
// (max-width:1024px) 60vw
// 50vw
// ' /> */}



