import type { NextConfig } from "next";
import { join } from "path";

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{hostname: 'raw.githubusercontent.com'}]
    },
    sassOptions: {
        includePaths: [join(__dirname, 'node_modules')],
    },
    rewrites: async () => ({
        beforeFiles: [{
            source: '/userDetails',
            destination: '/api/userDetails',
        }],
        afterFiles: [],
        fallback: [{
            source: '/api/:path*',
            destination: `${backendUrl}/:path*`
        }]
    }),
    output: "standalone"
};

export default nextConfig;
