import express from 'express';
import { proxyRequest } from '../controllers/proxyController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, proxyRequest);

export default router;
