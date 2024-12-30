import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing environment variables');
}

// Create a Supabase client with the service role key
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST() {
  try {
    // Try to create the user with admin privileges
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@test.com',
      password: 'ASdasd123',
      email_confirm: true,
      user_metadata: { is_test_user: true }
    });

    // If user already exists, that's fine
    if (error?.message?.includes('already exists')) {
      return NextResponse.json({ success: true });
    }

    // If there was another error, throw it
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
} 