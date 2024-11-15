'use client'
import { CldVideoPlayer } from "next-cloudinary";
import 'next-cloudinary/dist/cld-video-player.css';
import { headers } from "next/headers";

export default function GetVideo() {
    return (
        <main className="flex flex-col items-center justify-between p-24">
            <h1 className="text-5xl mb-12">My Amazing Video !!</h1>
            <CldVideoPlayer 
                width="620" 
                height="680" 
                src="evl6owynhpzqdyhe72jn" 
                sourceTypes={['hls','dash']} 
                transformation={{ streaming_profile: 'hd' }}
            />
            <span className="mt-8">
                Video by <a href="https://www.pexels.com">Pressmaster</a>
            </span>
        </main>
    );
}

{/* <CldVideoPlayer width={1080}
                 height={607}
                 src=''
                 transformation={{
                    crop:'fill',
                    gravity:"center",
                    width:1080,
                    height:307
                 }}
/> */}

// In the documentation of cloudinary nextjs video (Adaptive bitrate streaming)
// profileName      Aspect Ratio  
// 4k                    16:9
// full_hd               16:9
// full_hd_wifi          16:9
// full_hd_lean          16:9
// hd_lean               16:9
// hd                    16:9
// sd                     4:3