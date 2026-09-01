import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react', 'lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vlaigcvllbjvapktnirj.supabase.co',
      },
    ],
  },
};

export default nextConfig;
