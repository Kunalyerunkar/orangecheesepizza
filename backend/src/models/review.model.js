import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
   },
   rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
   },
   comment: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

// Prevent user from submitting more than one review per food item
reviewSchema.index({ user: 1, food: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);