'use client'
import { useEffect, useState, MouseEvent } from 'react';
import { ImageDisplay } from '@repo/ui/imageDisplay';
import { Post } from '../component/profileView';

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  alt: string
};

const UserImages = () => {
  const [userImages, setUserImages] = useState<CloudinaryResource[]>([]);
  const [showPost, setShowPost] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchUserImages = async () => {
      const response = await fetch('/api/getImageOnCloudinary');
      const { data } = await response.json();
      console.log(data)
      setUserImages(data);
    };

    fetchUserImages();
  }, []);

  const handleImageClick = (index: number) => (e: MouseEvent<HTMLDivElement>) => {
    setSelectedIndex(index);
    setShowPost(true);
  };

  const handleBackToGrid = () => {
    setShowPost(false);
  };

  return (
    <div className='w-[56%]  flex justify-center items-center h-[80vh] shadow-md'>
      {!showPost ? (
        // Grid view
        <div className='w-full h-full grid grid-cols-3 place-items-center gap-1 overflow-y-auto hide-scrollbar'>
          {userImages.map((image, index) => (
            <ImageDisplay
              onClick={handleImageClick(index)}
              key={image.public_id}
              public_id={image.public_id}
              secure_url={image.secure_url}
              alt={image.alt}
              type='profile'
            />
          ))}
        </div>
      ) : (
        // Post view with back button
        <div className='relative w-full h-full '>
          <button
          onClick={handleBackToGrid}
          className='absoulte top-4 left-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100'
          >
            ← Back
          </button>
          <Post
            response={userImages}
            currentIndex={selectedIndex}
            storeIndex={selectedIndex}
          />
        </div>
      )}
    </div>
  );
};

export default UserImages;