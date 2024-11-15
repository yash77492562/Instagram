'use client';

import { useState } from 'react';

export default function ImageUpload() {
  const [caption, setCaption] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('/api/generateCaption', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate caption');
      }

      const data = await response.json();
      setCaption(data.caption);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
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
          {loading ? 'Generating...' : 'Generate Caption'}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}

      {caption && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Generated Caption:</h3>
          <p className="mt-1 text-gray-600">{caption}</p>
        </div>
      )}
    </div>
  );
}