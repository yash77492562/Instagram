// components/Providers.tsx
'use client'

import { ImageProvider } from '../context/ImageContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return <ImageProvider>{children}</ImageProvider>;
}