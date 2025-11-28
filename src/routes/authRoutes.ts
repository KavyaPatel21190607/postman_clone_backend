import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

export default router;
