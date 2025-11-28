import express from 'express';
import { echo } from '../controllers/debugController';

const router = express.Router();

// Unprotected debug echo endpoint (use for debugging only)
router.all('/echo', echo);

export default router;
