'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Camera } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNewUser = searchParams.get('new') === 'true'
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    preferred_genders: '',
    bio: '',
    profile_pic_url: ''
  })

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        router.push('/login')
        return
      }
      loadProfile(session.user.id)
    }

    checkSession()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      if (!isNewUser) {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (profileError && profileError.code !== 'PGRST116') throw profileError

        if (data) {
          setFormData({
            name: data.name || '',
            age: data.age?.toString() || '',
            gender: data.gender || '',
            preferred_genders: data.preferred_genders || '',
            bio: data.bio || '',
            profile_pic_url: data.profile_pic_url || ''
          })
          if (data.profile_pic_url) {
            setImagePreview(data.profile_pic_url)
          }
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('No user logged in')

    const fileExt = file.name.split('.').pop()
    const fileName = `${session.user.id}-${Math.random()}.${fileExt}`
    const filePath = `profiles/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        throw new Error('No user logged in')
      }

      // Upload image if there's a new one
      let profile_pic_url = formData.profile_pic_url
      const fileInput = fileInputRef.current
      if (fileInput?.files?.[0]) {
        profile_pic_url = await uploadImage(fileInput.files[0])
      }

      // First, check if a profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      let error
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            name: formData.name,
            age: parseInt(formData.age),
            gender: formData.gender,
            preferred_genders: formData.preferred_genders,
            bio: formData.bio,
            profile_pic_url,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', session.user.id)
        error = updateError
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            user_id: session.user.id,
            name: formData.name,
            age: parseInt(formData.age),
            gender: formData.gender,
            preferred_genders: formData.preferred_genders,
            bio: formData.bio,
            profile_pic_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
        error = insertError
      }

      if (error) throw error

      setSuccess(true)
      // Route to matches page after successful profile creation/update
      router.push('/matches')
    } catch (err) {
      console.error('Error saving profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF6E6] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <h1 className="text-2xl font-bold text-[#E6B94D]">
            {isNewUser ? 'Complete Your Profile' : 'Edit Profile'}
          </h1>
        </header>

        <main className="py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                {isNewUser 
                  ? 'Tell us about yourself to start finding matches'
                  : 'Update your profile information'
                }
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div 
                    className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Profile picture"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? 'Change Picture' : 'Upload Picture'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_genders">Looking For</Label>
                  <Select
                    value={formData.preferred_genders}
                    onValueChange={(value) => setFormData({ ...formData, preferred_genders: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Men</SelectItem>
                      <SelectItem value="female">Women</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                {success && (
                  <p className="text-sm text-green-600">Profile saved successfully!</p>
                )}
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? 'Saving...' : (isNewUser ? 'Start Matching' : 'Save Changes')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}

