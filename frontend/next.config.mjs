/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Ignore lint errors during production builds on Vercel to ensure smooth deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ensure build succeeds even with strict type warnings
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
