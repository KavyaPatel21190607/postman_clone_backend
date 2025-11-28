import { Request, Response } from 'express';
import axios from 'axios';

export const proxyRequest = async (req: Request, res: Response) => {
    try {
        const { url, method, headers, body } = req.body;

        if (!url || !method) {
            res.status(400);
            throw new Error('URL and Method are required');
        }

        const response = await axios({
            url,
            method,
            headers,
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
        console.error('Proxy error:', error.message);
        res.status(500).json({
            message: error.message || 'Error forwarding request',
        });
    }
};
