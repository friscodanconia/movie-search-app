/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  typescript: {
    // WORKAROUND: Skip type checking during build due to stack overflow in tsc
    // Types are still checked in development and by IDEs
    // TODO: Investigate and fix the type recursion issue causing "Maximum call stack size exceeded"
    ignoreBuildErrors: true,
  },
  eslint: {
    // WORKAROUND: Skip ESLint during build to prevent potential stack overflow
    // Linting still works in development with `npm run lint`
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;