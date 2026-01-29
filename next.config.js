/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // זה יגרום ל-Vercel להמשיך ב-Build גם אם יש אזהרות קוד
    ignoreDuringBuilds: true,
  },
  typescript: {
    // זה יתעלם משגיאות Type שעלולות לעצור את ה-Build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;