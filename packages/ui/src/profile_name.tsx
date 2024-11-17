'use client'
import { CldImage } from "next-cloudinary";

type CloudinaryResource = {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    alt: string;
};

interface ProfileNameProps {
    response: CloudinaryResource;
    index: number;
    onModify: (index: number, data: CloudinaryResource) => void; // Pass handler function
}

export const Profile_name = ({ response, index, onModify }: ProfileNameProps) => {
    return (
        <div className="flex w-full items-center bg-gray-100 h-[70px] pl-4">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                <CldImage
                    src='https://res.cloudinary.com/devvtesr9/image/upload/v1731733807/Images/yash7749/11.webp'
                    alt='profile'
                    width={50}
                    height={50}
                    className="object-cover"
                />
            </div>
            <div className="flex-1 h-full flex items-center justify-between">
                <div className="flex flex-col justify-center items-center">
                    <div className="font-bold pl-4 text-black cursor-pointer">yash</div>
                </div>
                <div
                    className="pr-4 text-gray-500 underline cursor-pointer"
                    onClick={() => onModify(index, response)} // Call handler on click
                >
                    Modify
                </div>
            </div>
        </div>
    );
};
