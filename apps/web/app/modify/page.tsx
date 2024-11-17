// app/modify/page.tsx
'use client'

import { useImage } from '../context/ImageContext';
import { ModifyImage } from '../component/modify/modifyImage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ModifyImagePage() {
    const { selectedImage } = useImage();
    const router = useRouter();

    useEffect(() => {
        // If no image is selected, redirect to home
        if (!selectedImage) {
            router.push('/');
        }
    }, [selectedImage, router]);

    if (!selectedImage) {
        return null;
    }

    return <ModifyImage image={selectedImage} />;
}