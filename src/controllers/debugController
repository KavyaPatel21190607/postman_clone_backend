import { Request, Response } from 'express';

export const echo = (req: Request, res: Response) => {
    // Return headers and body to help debug frontend -> backend connectivity and CORS
    res.json({
        ok: true,
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query,
    });
};

export default { echo };
