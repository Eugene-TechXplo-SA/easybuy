/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://cgmlroqsxmrlifsqgbom.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbWxyb3FzeG1ybGlmc3FnYm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDEyMjQsImV4cCI6MjA5MTMxNzIyNH0.6trYNCH-kETbzDk8-d2o_RXzkpguLwjg7dGqrfIk2L0",
  },
};

module.exports = nextConfig;
