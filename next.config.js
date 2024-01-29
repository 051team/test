/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.discordapp.com", "casadepapeldev.blob.core.windows.net"],
  },
}

module.exports = nextConfig;
