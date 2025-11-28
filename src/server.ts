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

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Debug: log incoming origin for troubleshooting
        console.log('[CORS] incoming origin:', origin);

        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin) return callback(null, true);

        // Allow explicitly allowed origins
        if (allowedOrigins.length === 0 || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // In development, allow localhost / 127.0.0.1 with any port
        const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
        if (process.env.NODE_ENV === 'development' && isLocalhost) {
            return callback(null, true);
        }

        console.warn(`[CORS] blocked origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
    },
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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
