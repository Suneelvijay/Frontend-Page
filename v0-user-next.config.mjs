 /**
 * Custom Next.js configuration for backend API proxy
 */

/** @type {import('next').NextConfig} */
const userNextConfig = {
    // API route proxy configuration to avoid CORS issues
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*', // Replace with your backend API URL
        },
      ];
    },
    // Additional image domains for remote images
    images: {
      domains: ['localhost'],
    },
  };
  
  export default userNextConfig;