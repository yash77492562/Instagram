// hooks/useImagePosition.ts
import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
  zoom: number;
}

interface ImagePositionData {
  imageId: string;
  index: number;
  position: Position;
}

export function useImagePosition(imageId: string, index: number) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, zoom: 1.0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await fetch(`/api/imagePosition?imageId=${imageId}`);
        if (response.ok) {
          const data = await response.json();
          setPosition(data.position);
        }
      } catch (err) {
        console.error('Error fetching position:', err);
        setError('Failed to load image position');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosition();
  }, [imageId]);

  const updatePosition = async (newPosition: Position) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/imagePosition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId,
          index,
          position: newPosition,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update position');
      }

      setPosition(newPosition);
    } catch (err) {
      console.error('Error updating position:', err);
      setError('Failed to save image position');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    position,
    updatePosition,
    isLoading,
    error,
  };
}