'use client';

import { useState , useEffect } from 'react';
import { CldImage } from "next-cloudinary";
import { userAgent } from 'next/server';
import axios from 'axios';

interface CaptioningResult {
  caption: string;
  alt: string;
}
interface FullCloudinaryResponse {
  api_key?: string;
  asset_id: string;
  bytes: number;
  created_at: string;
  display_name: string;
  format: string;
  height: number;
  public_id: string;
  resource_type: string;
  secure_url: string;
  tags: string[];
  width: number;
  [key: string]: any; // for other properties we don't need
}
interface CloudinaryResponse {
  public_id: string;                  
  display_name:string;
  tags:string[];
  resource_type:string
  secure_url: string;
  userId?:string 
}

export default function ImageUploadWithCaption() {
  const [result, setResult] = useState<CloudinaryResponse | null>(null);
  const [captioningResult, setCaptioningResult] = useState<CaptioningResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  function transformCloudinaryResponse(fullResponse: FullCloudinaryResponse): CloudinaryResponse {
    return {
      public_id: fullResponse.public_id,
      display_name: fullResponse.display_name,
      tags: fullResponse.tags,
      resource_type: fullResponse.resource_type,
      secure_url: fullResponse.secure_url
    };
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(event.currentTarget);
      
      // First, generate caption
      const captionResponse = await fetch('/api/generateCaption', {
        method: 'POST',
        body: formData, // Send the entire FormData with the image
      });

      if (!captionResponse.ok) {
        throw new Error('Failed to generate caption');
      }

      const captionData = await captionResponse.json();
      console.log(captionData)
      console.log(captionData.caption)
      setCaptioningResult(captionData);

      // Then, upload to Cloudinary with the caption
      const uploadFormData = new FormData();
      uploadFormData.append('image', formData.get('image') as File);
      uploadFormData.append('alt', captionData.caption); // Include the generated alt text
      uploadFormData.append('caption', captionData.caption); // Include the generated caption
      console.log(uploadFormData,'uploadFormData')
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const response = await uploadResponse.json();
      let cloudinaryData = transformCloudinaryResponse(response.data.result)
      // const obj = {cloudinaryData,response.data.userId}
      cloudinaryData = { ...cloudinaryData, userId: response.data.userId };
      setResult((cloudinaryData));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const imageDatabase = async () => {
      try {
        const response = await axios.post('/api/imageCreateDatabase', result, {
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!response) {
          setError('Problem while uploading image');
        } else {
          console.log('Database response:', response.data);
        }
      } catch (err) {
        setError('Problem while uploading image');
        console.error('Error saving to database:', err);
      }
    };
  
    // Only call imageDatabase if result has valid data
    if (result) {
      imageDatabase();
    }
  }, [result]);
  
  return (
    <main className="p-16 text-center">
      <h1 className="text-5xl font-medium py-8">Image Upload App</h1>
      <section className="flex flex-col items-center justify-between">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              required
              className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent 
                     shadow-sm text-sm font-medium rounded-md text-white 
                     bg-blue-600 hover:bg-blue-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Upload Image'}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-600">
            {error}
          </div>
        )}

        {result && captioningResult && (
          <div className="mt-8">
            <CldImage
              src={result.public_id}
              width='400'
              height='400'
              alt={captioningResult.alt}
            />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Generated Caption:</h3>
              <p className="mt-1 text-gray-600">{captioningResult.caption}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

//  get this details from the server resposne from cloudinary 
// dispaly_name,tags,public_id,resource_type,secure_url