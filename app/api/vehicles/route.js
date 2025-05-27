// This is a Next.js API route that forwards requests to the backend API
import { NextResponse } from 'next/server';

// Handler for importing vehicles
export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Get the token from the request headers
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Forward the request to the backend API
    const response = await fetch('http://192.168.125.84:8080/api/vehicles/import', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData,
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Error importing vehicles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import vehicles' },
      { status: 500 }
    );
  }
} 