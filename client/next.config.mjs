/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["images.unsplash.com", "target.scene7.com"],
      },

      async rewrites() {
        return [
          {
            source: "/dashboard/products",
            destination: "/dashboard/views/products",
          }
        ]
      }
};

export default nextConfig;
