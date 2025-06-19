import Food from '../models/food.model.js';
import Review from '../models/review.model.js';

// Add a review
export const addReview = async (req, res) => {
   try {
      const { foodId, rating, comment } = req.body;

      // Check if user has already reviewed this food item
      const existingReview = await Review.findOne({
         user: req.user.id,
         food: foodId,
      });

      if (existingReview) {
         return res.status(400).json({ message: 'You have already reviewed this food item' });
      }

      // Create the review
      const review = await Review.create({
         user: req.user.id,
         food: foodId,
         rating,
         comment,
      });

      // Update food item's rating
      const food = await Food.findById(foodId);
      if (!food) {
         return res.status(404).json({ message: 'Food item not found' });
      }

      // Get all reviews for this food item
      const reviews = await Review.find({ food: foodId });

      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      // Update food item
      food.ratings = averageRating;
      food.numReviews = reviews.length;
      await food.save();

      res.status(201).json(review);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get reviews for a food item
export const getFoodReviews = async (req, res) => {
   try {
      const reviews = await Review.find({ food: req.params.foodId })
         .populate('user', 'name')
         .sort('-createdAt');

      res.json(reviews);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Update a review
export const updateReview = async (req, res) => {
   try {
      const { rating, comment } = req.body;

      const review = await Review.findOne({
         _id: req.params.id,
         user: req.user.id,
      });

      if (!review) {
         return res.status(404).json({ message: 'Review not found or not authorized' });
      }

      review.rating = rating || review.rating;
      review.comment = comment || review.comment;

      const updatedReview = await review.save();

      // Update food item's rating
      const foodId = review.food;

      // Get all reviews for this food item
      const reviews = await Review.find({ food: foodId });

      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      // Update food item
      const food = await Food.findById(foodId);
      food.ratings = averageRating;
      await food.save();

      res.json(updatedReview);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Delete a review
export const deleteReview = async (req, res) => {
   try {
      const review = await Review.findOne({
         _id: req.params.id,
         user: req.user.id,
      });

      if (!review) {
         return res.status(404).json({ message: 'Review not found or not authorized' });
      }

      const foodId = review.food;

      await review.remove();

      // Update food item's rating
      // Get all reviews for this food item
      const reviews = await Review.find({ food: foodId });

      // Calculate average rating
      let averageRating = 0;
      if (reviews.length > 0) {
         const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
         averageRating = totalRating / reviews.length;
      }

      // Update food item
      const food = await Food.findById(foodId);
      food.ratings = averageRating;
      food.numReviews = reviews.length;
      await food.save();

      res.json({ message: 'Review removed' });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
}; 