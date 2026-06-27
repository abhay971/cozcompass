/** @type {import('next').NextConfig} */
const nextConfig = {
  // Off: StrictMode double-invokes effects in dev, which replays the one-shot
  // splash/GSAP intros twice. Production behaviour is unchanged (single invoke).
  reactStrictMode: false,
  poweredByHeader: false,
  compiler: {
    // Strip console.* in production builds (keeps errors/warnings).
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    // three.js is large — let Next optimize the barrel import.
    optimizePackageImports: ["three", "gsap"],
  },
};

export default nextConfig;
