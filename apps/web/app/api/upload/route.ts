// route.ts (POST - Upload)
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

async function checkFolderExists(folderPath: string): Promise<boolean> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
      max_results: 1
    });
    return result.resources.length > 0;
  } catch (error) {
    return false;
  }
}

async function createFolder(folderPath: string): Promise<void> {
  try {
    await cloudinary.uploader.upload(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      {
        folder: folderPath,
        public_id: '.folder'
      }
    );
    await cloudinary.uploader.destroy(`${folderPath}/.folder`);
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const alt = formData.get('alt') as string;
    const caption = formData.get('caption') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
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

    const userId = user_details.id;
    const userFolderPath = `Images/${decryptUserName}`;

    const mainFolderExists = await checkFolderExists('Images');
    if (!mainFolderExists) {
      await createFolder('Images');
    }

    const userFolderExists = await checkFolderExists(userFolderPath);
    if (!userFolderExists) {
      await createFolder(userFolderPath);
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: userFolderPath,
          tags: [`${decryptUserName}`],
          resource_type: 'auto',
          public_id: file.name.split('.')[0],
          context: {
            alt: alt || '',
            caption: caption || ''
          }
        },
        function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ data: { result, userId } });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Error uploading image' },
      { status: 500 }
    );
  }
}
