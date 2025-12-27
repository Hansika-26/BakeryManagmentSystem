import express from 'express';
import {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    deleteOrder,
    getOrderStats,
    confirmDelivery
} from '../controllers/orderController.js';
import { authenticateUser, authorizePermissions } from '../middleware/userAuth.js';

const router = express.Router();

// Admin routes (protected + admin only) - MUST be before /:id routes
router.get('/stats/summary', authenticateUser, authorizePermissions('admin'), getOrderStats);
router.get('/all', authenticateUser, authorizePermissions('admin'), getAllOrders);
router.patch('/:id/status', authenticateUser, authorizePermissions('admin'), updateOrderStatus);
router.delete('/:id', authenticateUser, authorizePermissions('admin'), deleteOrder);

// User routes (protected)
router.post('/', authenticateUser, createOrder);
router.get('/my-orders', authenticateUser, getUserOrders);
router.get('/:id', authenticateUser, getOrderById);
router.patch('/:id/cancel', authenticateUser, cancelOrder);
router.patch('/:id/confirm-delivery', authenticateUser, confirmDelivery);

export default router;
