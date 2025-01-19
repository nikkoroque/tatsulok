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
          },
          {
            source: "/dashboard/suppliers",
            destination: "/dashboard/views/suppliers",
          }
        ]
      }
};

export default nextConfig;
