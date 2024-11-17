// app/layout.tsx
import { ImageProvider } from "../context/ImageContext";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ImageProvider>
                    {children}
                </ImageProvider>
            </body>
        </html>
    );
}