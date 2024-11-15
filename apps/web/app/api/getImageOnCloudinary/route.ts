
// route.ts (GET - Retrieve)
import { NextResponse } from 'next/server';
import cloudinary from '../../backend/cloudinaryConfig';
import { userDetails } from '../../database/userInformation_getUserId/user_details';
import { decrypt } from '@repo/encrypt/client';

type UserDetails = {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  tags: string[];
} | "Couldn't connect database right now" | null;

type CloudinaryContext = {
  custom: {
    alt: string;
    caption: string;
  };
};

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  alt?: string;
  caption?: string;
};

type CloudinaryApiResponse = {
  resources: {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    context?: CloudinaryContext;
  }[];
  [key: string]: any;
};

export async function GET(request: Request) {
  try {
    const user_details: UserDetails = await userDetails();

    if (typeof user_details === 'string' || user_details === null) {
      console.error("Couldn't connect to the database right now");
      return NextResponse.json(
        { error: "Couldn't connect to the database right now" },
        { status: 500 }
      );
    }

    const username = user_details.username;
    const decryptUserName = decrypt(username);

    if (!decryptUserName) {
      console.error("Error while decrypting Information");
      return NextResponse.json(
        { error: "Error while decrypting Information" },
        { status: 500 }
      );
    }

    const userFolderPath = `Images/${decryptUserName}`;

    const response: CloudinaryApiResponse = await cloudinary.api.resources({
      type: 'upload',
      prefix: userFolderPath,
      max_results: 100,
      context: true // Add this to ensure context is included in the response
    });
    console.log(response)
    const userImages: CloudinaryResource[] = response.resources.map((resource) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      alt: resource.context?.custom?.alt || '',
      caption: resource.context?.custom?.caption || ''
    }));

    return NextResponse.json({ data: userImages });
  } catch (error) {
    console.error('Error retrieving user images:', error);
    return NextResponse.json(
      { error: 'Error retrieving user images' },
      { status: 500 }
    );
  }
}