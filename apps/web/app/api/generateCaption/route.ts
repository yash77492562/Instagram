import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

// Ensure you have a valid Hugging Face Access Token
// const HF_ACCESS_TOKEN = process.env.IMAGE_READER_API || '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';
// console.log(process.env.IMAGE_READER_API)
// const hf = new HfInference(HF_ACCESS_TOKEN);

// POST request handler
export async function POST(request: Request) {
  // Ensure you have a valid Hugging Face Access Token
  const HF_ACCESS_TOKEN = process.env.HUGGINGFACE_ACCESS_TOKEN;
  const hf = new HfInference(HF_ACCESS_TOKEN);
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No image file uploaded' }, { status: 400 });
    }

    // Convert the file to array buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Call Hugging Face API for image caption generation
    const caption = await hf.imageToText({
      data: buffer,
      model: 'nlpconnect/vit-gpt2-image-captioning',
    });

    // Respond with the generated caption
    return NextResponse.json({ caption: caption?.generated_text || 'No caption available' });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ message: 'Failed to generate caption' }, { status: 500 });
  }
}