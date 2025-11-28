import express from 'express';
import {
    getHistory,
    addToHistory,
    clearHistory,
    getCollections,
    createCollection,
    deleteCollection,
    addItemToCollection,
} from '../controllers/dataController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Root info route - helpful for clients to discover available API endpoints
router.get('/', (req, res) => {
    res.json({
        message: 'API root',
        endpoints: {
            auth: {
                register: '/api/auth/register',
                login: '/api/auth/login',
            },
            proxy: {
                post: '/api/proxy',
            },
            history: {
                get: '/api/history',
                post: '/api/history',
                delete: '/api/history',
            },
            collections: {
                list: '/api/collections',
                create: '/api/collections',
                delete: '/api/collections/:id',
                addItem: '/api/collections/:id/items',
            },
        },
    });
});

router.route('/history')
    .get(protect, getHistory)
    .post(protect, addToHistory)
    .delete(protect, clearHistory);

router.route('/collections')
    .get(protect, getCollections)
    .post(protect, createCollection);

router.route('/collections/:id')
    .delete(protect, deleteCollection);

router.route('/collections/:id/items')
    .post(protect, addItemToCollection);

export default router;
