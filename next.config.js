/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['chdxujfwuwhmktxsdyjj.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chdxujfwuwhmktxsdyjj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig