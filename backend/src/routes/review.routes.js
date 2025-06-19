import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/reviews
// @desc    Add a review
// @access  Private
router.post('/', protect, reviewController.addReview);

// @route   GET /api/reviews/food/:foodId
// @desc    Get reviews for a food item
// @access  Public
router.get('/food/:foodId', reviewController.getFoodReviews);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', protect, reviewController.updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, reviewController.deleteReview);

export default router;
