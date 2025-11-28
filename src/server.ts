import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db';
import { errorHandler } from './middleware/error';

dotenv.config();

connectDB();

const app = express();

// Configure CORS to allow only origins specified in `CLIENT_URL` or `ALLOWED_ORIGINS` env vars.
const rawAllowed = process.env.CLIENT_URL || process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawAllowed.split(',').map(s => s.trim()).filter(Boolean);

// Helper to match origin against allowedOrigins, supporting leading-dot wildcards like `.example.com`
function originAllowed(origin: string, list: string[]) {
    if (!origin) return false;
    try {
        const url = new URL(origin);
        const hostname = url.hostname;
        // Exact match first
        if (list.indexOf(origin) !== -1 || list.indexOf(url.origin) !== -1) return true;
        // Hostname matches: exact or wildcard like `.example.com`
        for (const allowed of list) {
            if (!allowed) continue;
            // allow entries like `https://app.example.com` or `app.example.com` or `.example.com`
            if (allowed.startsWith('.')) {
                if (hostname.endsWith(allowed)) return true;
            } else if (allowed.includes('://')) {
                const a = new URL(allowed);
                if (a.hostname === hostname) return true;
            } else {
                if (hostname === allowed) return true;
            }
        }
    } catch (e) {
        // invalid origin format
    }
    return false;
}

// If no allowed origins are configured, allow all origins (useful for quick deploys). Otherwise check list.
let corsOptions: cors.CorsOptions;
if (allowedOrigins.length === 0) {
    corsOptions = { origin: true, optionsSuccessStatus: 200 };
} else {
    corsOptions = {
        origin: (origin, callback) => {
            console.log('[CORS] incoming origin:', origin);
            // Allow non-browser requests (no origin)
            if (!origin) return callback(null, true);

            // Allow if explicitly allowed or matches wildcard/hostname
            if (originAllowed(origin, allowedOrigins)) return callback(null, true);

            // In development allow localhost/127.0.0.1
            const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
            if (process.env.NODE_ENV === 'development' && isLocalhost) return callback(null, true);

            console.warn(`[CORS] blocked origin: ${origin}`);
            return callback(new Error('Not allowed by CORS'));
        },
        optionsSuccessStatus: 200,
    };
}

// Apply CORS and also explicitly handle preflight for all routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

import authRoutes from './routes/authRoutes';
import dataRoutes from './routes/dataRoutes';
import proxyRoutes from './routes/proxyRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/proxy', proxyRoutes);
app.use('/api', dataRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
