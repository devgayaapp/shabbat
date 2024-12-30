import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Check if the user is authenticated and is an admin
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role (you'll need to implement this based on your user metadata or a separate admin table)
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', session.user.id)
      .single()

    if (userError || !userData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json();
    const { name, age, gender, preferred_genders, bio, profile_pic_url } = body;

    // Create the profile directly (no user auth creation)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        name,
        age,
        gender,
        preferred_genders,
        bio,
        profile_pic_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (profileError) throw profileError;

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create profile' },
      { status: 500 }
    );
  }
} 