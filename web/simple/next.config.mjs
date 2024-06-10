/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'alpha-avatar-thumbnail.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/*',
      },
    ],
  },
};

export default nextConfig;
