import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import History from '../models/History';
import Collection from '../models/Collection';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get user history
// @route   GET /api/history
// @access  Private
export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const history = await History.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(history);
});

// @desc    Add to history
// @route   POST /api/history
// @access  Private
export const addToHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { url, method, params, headers, body, response } = req.body;

    const history = await History.create({
        user: req.user._id,
        url,
        method,
        params,
        headers,
        body,
        response,
    });

    res.status(201).json(history);
});

// @desc    Clear history
// @route   DELETE /api/history
// @access  Private
export const clearHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    await History.deleteMany({ user: req.user._id });
    res.json({ message: 'History cleared' });
});

// @desc    Get user collections
// @route   GET /api/collections
// @access  Private
export const getCollections = asyncHandler(async (req: AuthRequest, res: Response) => {
    const collections = await Collection.find({ user: req.user._id });
    res.json(collections);
});

// @desc    Create collection
// @route   POST /api/collections
// @access  Private
export const createCollection = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name } = req.body;

    const collection = await Collection.create({
        user: req.user._id,
        name,
        items: [],
    });

    res.status(201).json(collection);
});

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private
export const deleteCollection = asyncHandler(async (req: AuthRequest, res: Response) => {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
        res.status(404);
        throw new Error('Collection not found');
    }

    if (collection.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await collection.deleteOne();
    res.json({ message: 'Collection removed' });
});

// @desc    Add item to collection
// @route   POST /api/collections/:id/items
// @access  Private
export const addItemToCollection = asyncHandler(async (req: AuthRequest, res: Response) => {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
        res.status(404);
        throw new Error('Collection not found');
    }

    if (collection.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    collection.items.push(req.body);
    await collection.save();

    res.json(collection);
});
