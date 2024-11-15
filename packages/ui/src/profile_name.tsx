'use client'
import { CldImage } from "next-cloudinary";
type CloudinaryResource = {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    alt:string
};
  
interface ProfileNameProps{
    response:CloudinaryResource
}
export const Profile_name = ()=>{
    return <div className="flex w-full items-center bg-gray-100 h-[70px] pl-4">
        <div className="w-[50px] h-[50px]  rounded-full overflow-hidden">
             <CldImage 
               src='https://res.cloudinary.com/devvtesr9/image/upload/v1731479266/Images/yash/11.webp'
               alt='profile'
               width={50}
               height={50}
               className="object-cover"
             />
        </div>
        <div className="pl-4 flex flex-col justify-center items-center">
            <div className="text-black cursor-pointer font-bold">yash</div>
        </div>
    </div>
}