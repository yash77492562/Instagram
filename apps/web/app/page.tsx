import GetVideo from "./cloudStore/getVideo";
import { All_user } from "./frontendfile/all_user";
import GetImageCloudinary from "./cloudStore/getImageCloudinary";
import ImageReader from "./frontendfile/imageReader";
import ImageUploadWithCaption from "./cloudStore/ImageUpload";
import UserImages from "./frontendfile/getImage";

export default function Home() {
  return (
    <div className="w-full h-screen  flex justify-center items-center">
       {/* <All_user /> */}
       {/* <GetImageCloudinary /> */}
       {/* <ImageReader /> */}
       {/* <ImageUploadWithCaption /> */}
       <UserImages />
    </div>
  );
}

