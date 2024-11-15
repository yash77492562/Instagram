/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        loader:'custom',
        loaderFile:'/src/utils/cloudinary-loader.ts'
    }
};

export default nextConfig;
