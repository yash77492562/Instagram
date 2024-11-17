// components/Post.tsx
'use client'

import { ImageDisplay } from "@repo/ui/imageDisplay";
import { Profile_name } from "@repo/ui/profile_name";
import { useRouter } from "next/navigation";
import { useImage } from "../context/ImageContext";

type CloudinaryResource = {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    alt: string;
};

interface PostProps {
    response: CloudinaryResource[];
    currentIndex: number;
    storeIndex: number;
}

export const Post = ({ response, currentIndex, storeIndex }: PostProps) => {
    const router = useRouter();
    const { setSelectedImage } = useImage();

    const handler = (index: number, data: CloudinaryResource) => {
        // Set the image data in context
        setSelectedImage({
            current_index: index,
            public_id: data.public_id,
            secure_url: data.secure_url,
            alt: data.alt
        });
        
        // Navigate to modify page without query params
        router.push('/modify');
    };

    return (
        <div className="w-full gap-4 h-[90%] grid grid-cols-1 place-items-center justify-center items-center overflow-y-auto hide-scrollbar">
            {response.map((image, index) => (
                <div key={image.public_id} className="w-[450px] h-auto bg-black">
                    <Profile_name
                        response={image}
                        index={index}
                        onModify={handler}
                    />
                    <ImageDisplay
                        public_id={image.public_id}
                        secure_url={image.secure_url}
                        alt={image.alt}
                        type="view"
                    />
                </div>
            ))}
        </div>
    );
};