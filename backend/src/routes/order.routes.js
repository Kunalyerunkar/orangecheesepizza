import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { admin, protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, orderController.createOrder);

// @route   GET /api/orders/user
// @desc    Get all orders for a user
// @access  Private
router.get('/user', protect, orderController.getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, orderController.getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status
// @access  Private/Admin
router.put('/:id/payment', protect, admin, orderController.updatePaymentStatus);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, admin, orderController.getAllOrders);

// @route   GET /api/orders/stats
// @desc    Get order statistics
// @access  Private/Admin
router.get('/stats/all', protect, admin, orderController.getOrderStats);

export default router;