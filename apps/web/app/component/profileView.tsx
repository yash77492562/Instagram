import { ImageDisplay } from "@repo/ui/imageDisplay";
import { Profile_name } from "@repo/ui/profile_name";

type CloudinaryResource = {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    alt:string
};
  
interface PostProps{
    response:CloudinaryResource[]
    currentIndex : number 
    storeIndex:number
}
export const  Post = ({response,currentIndex,storeIndex}:PostProps)=>{
    return (
        <div className='w-full  gap-4 h-[90%] grid grid-cols-1 place-items-center  justify-center items-center overflow-y-auto hide-scrollbar'>
          
          {response.map((image) => (
            <div className="w-[450px] h-auto bg-black">
              <Profile_name />
              <ImageDisplay 
                key={image.public_id} 
                public_id={image.public_id} 
                secure_url={image.secure_url}  
                alt={image.alt}
                type='view'
              />
            </div>
          ))}
        </div>
      );
}