import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.error('NEXT_PUBLIC_API_URL is not defined');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}