'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
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
import { useUser } from '@/contexts/UserContext'
import AuthLoading from '@/components/auth/loading'

function ProfileForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNewUser = searchParams.get('new') === 'true'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useUser()
  
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
    if (user) {
      loadProfile(user.id)
    }
  }, [user])

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
    if (!user) throw new Error('No user logged in')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
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

  const getReadableError = (error: string) => {
      if (error.includes('profiles_age_check')) {
        return 'Please enter a valid age between 18 and 120'
      }
      if (error.includes('profiles_gender_check')) {
        return 'Please select a valid gender'
      }
      if (error.includes('profiles_preferred_genders_check')) {
        return 'Please select a valid preference'
      }
      if (error.includes('Failed to upload image')) {
        return 'Unable to upload image. Please try a different image or try again later'
      }
      return 'Something went wrong. Please try again'
    }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)
  
    try {
      if (!user) {
        throw new Error('Please log in to continue')
      }
  
      // Upload image if there's a new one
      let profile_pic_url = formData.profile_pic_url
      const fileInput = fileInputRef.current
      if (fileInput?.files?.[0]) {
        try {
          profile_pic_url = await uploadImage(fileInput.files[0])
        } catch (uploadErr) {
          throw new Error(`Failed to upload image: ${uploadErr instanceof Error ? uploadErr.message : 'Unknown error'}`)
        }
      }
  
      // First, check if a profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
  
      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Failed to check profile: ${checkError.message}`)
      }
  
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
          .eq('user_id', user.id)
        error = updateError
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            user_id: user.id,
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
  
      if (error) {
        throw new Error(error.message)
      }
  
      setSuccess(true)
      router.push('/matches')
    } catch (err) {
      console.error('Error saving profile:', err)
      setError(getReadableError(err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <AuthLoading />
  }

  // Add this at the beginning of the component
  const handleNavigation = () => {
    if (isNewUser) {
      router.push('/dashboard')
    } else {
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <h1 
            onClick={handleNavigation}
            className="text-2xl font-bold text-[#E6B94D] cursor-pointer hover:text-[#d4a73c] transition-colors"
          >
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
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      <SelectItem value="male" className="cursor-pointer hover:bg-gray-50">Male</SelectItem>
                      <SelectItem value="female" className="cursor-pointer hover:bg-gray-50">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_genders">Looking For</Label>
                  <Select
                    value={formData.preferred_genders}
                    onValueChange={(value) => setFormData({ ...formData, preferred_genders: value })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      <SelectItem value="male" className="cursor-pointer hover:bg-gray-50">Men</SelectItem>
                      <SelectItem value="female" className="cursor-pointer hover:bg-gray-50">Women</SelectItem>
                      <SelectItem value="both" className="cursor-pointer hover:bg-gray-50">Both</SelectItem>
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

export default function ProfilePage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <ProfileForm />
    </Suspense>
  )
}

