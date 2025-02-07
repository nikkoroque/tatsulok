/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["images.unsplash.com", "target.scene7.com" , "avatar.vercel.sh"],
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
          },
          {
            source: "/dashboard/categories",
            destination: "/dashboard/views/categories",
          },
          {
            source: "/transactions",
            destination: "/dashboard/views/transactions",
          },
        ]
      }
};

export default nextConfig;
