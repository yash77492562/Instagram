// context/ImageContext.tsx
'use client'

import { createContext, useContext, ReactNode, useState } from 'react';

type ImageResource = {
    current_index: number;
    public_id: string;
    secure_url: string;
    alt: string;
};

type ImageContextType = {
    selectedImage: ImageResource | null;
    setSelectedImage: (image: ImageResource | null) => void;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: ReactNode }) {
    const [selectedImage, setSelectedImage] = useState<ImageResource | null>(null);

    return (
        <ImageContext.Provider value={{ selectedImage, setSelectedImage }}>
            {children}
        </ImageContext.Provider>
    );
}

export const useImage = () => {
    const context = useContext(ImageContext);
    if (!context) {
        throw new Error('useImage must be used within an ImageProvider');
    }
    return context;
};