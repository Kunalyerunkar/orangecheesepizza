import express from 'express';
import * as foodController from '../controllers/food.controller.js';
import { admin, protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// @route   GET /api/foods
// @desc    Get all food items
// @access  Public
router.get('/', foodController.getAllFoods);

// @route   GET /api/foods/:id
// @desc    Get food by ID
// @access  Public
router.get('/:id', foodController.getFoodById);

// @route   POST /api/foods
// @desc    Create a new food item
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), foodController.createFood);

// @route   PUT /api/foods/:id
// @desc    Update a food item
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), foodController.updateFood);

// @route   DELETE /api/foods/:id
// @desc    Delete a food item
// @access  Private/Admin
router.delete('/:id', protect, admin, foodController.deleteFood);

// @route   GET /api/foods/featured
// @desc    Get featured food items
// @access  Public
router.get('/featured/items', foodController.getFeaturedFoods);

// @route   GET /api/foods/offers/special
// @desc    Get special offers
// @access  Public
router.get('/offers/special', foodController.getSpecialOffers);

export default router;