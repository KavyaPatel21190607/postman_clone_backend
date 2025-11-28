import { Request, Response } from 'express';
import axios from 'axios';

export const proxyRequest = async (req: Request, res: Response) => {
    try {
        const { url, method, headers, body } = req.body || {};

        // Log request body for debugging (avoid logging sensitive data in production)
        console.log('[PROXY] incoming body:', {
            url: url?.toString?.(),
            method,
            headers: headers ? Object.keys(headers) : undefined,
            hasBody: !!body,
        });

        if (!url || !method) {
            res.status(400).json({ message: 'URL and Method are required' });
            return;
        }

        // Normalize method to lowercase to satisfy axios expectations
        const normalizedMethod = typeof method === 'string' ? method.toLowerCase() : method;

        const response = await axios({
            url,
            method: normalizedMethod as any,
            headers: headers || {},
            data: body,
            validateStatus: () => true, // Resolve promise for all status codes
        });

        // Forward the original status code so the frontend can see 404/401/etc.
        res.status(response.status).json({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
        });
    } catch (error: any) {
        console.error('[PROXY] error message:', error?.message);
        console.error('[PROXY] error stack:', error?.stack);
        // If axios produced a response, include status and data for debugging
        if (error?.response) {
            console.error('[PROXY] remote status:', error.response.status);
            console.error('[PROXY] remote data:', error.response.data);
            return res.status(502).json({ message: 'Upstream request failed', details: error.response.data });
        }

        res.status(500).json({
            message: error.message || 'Error forwarding request',
        });
    }
};
