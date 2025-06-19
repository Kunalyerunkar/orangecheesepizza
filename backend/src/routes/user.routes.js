import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { admin, protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', userController.registerUser);

// @route   POST /api/users/login
// @desc    User login
// @access  Public
router.post('/login', userController.loginUser);

// @route   POST /api/users/admin/login
// @desc    Admin login
// @access  Public
router.post('/admin/login', userController.adminLogin);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, userController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, userController.updateUserProfile);

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, admin, userController.getUsers);

export default router;