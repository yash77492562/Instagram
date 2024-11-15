import { ImageLoaderProps } from "next/image";

export default function CloudinaryLoader ({ src, width, quality }: ImageLoaderProps)  {
    console.log('hello I am called')
    const params = [ "f_auto", "c_limit", `w_${width}`, `q_${quality ?? 'auto'}`];
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_API_CLOUD_NAME}/image/upload/${params.join(',')}/${src}`;
};


