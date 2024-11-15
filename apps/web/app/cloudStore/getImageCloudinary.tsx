'use client'
import { CldImage } from "next-cloudinary";
export default function GetImageCloudinary(){
    return (
        <main className="flex h-full min-h-screen  flex-col justify-center items-center">
            <div className="max-w-lg">
                <CldImage
                   width="600"
                   height="800"
                   src=''
                   alt=""
                   sizes=""
                   />
            </div>
        </main>
    )
}