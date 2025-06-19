import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true,
   },
   description: {
      type: String,
      required: true,
   },
   price: {
      type: Number,
      required: true,
   },
   image: {
      type: String,
      required: true,
   },
   category: {
      type: String,
      required: true,
      enum: ['Veg Pizzas', 'Non-Veg Pizzas', 'Value Pizza', 'Garlic Bread', 'Taco', 'Appetizer', 'Kebab', 'Momo', 'Burger', 'Dessert', 'Biryani'],
   },
   isAvailable: {
      type: Boolean,
      default: true,
   },
   isFeatured: {
      type: Boolean,
      default: false,
   },
   ratings: {
      type: Number,
      default: 0,
   },
   numReviews: {
      type: Number,
      default: 0,
   },
   ingredients: [{
      type: String,
   }],
   specialOffer: {
      type: Boolean,
      default: false,
   },
   customizationOptions: {
      sizes: [{
         name: {
            type: String,
            enum: ['Regular', 'Medium', 'Large'],
         },
         price: {
            type: Number,
         }
      }],
      crusts: [{
         name: {
            type: String,
         },
         price: {
            type: Number,
         }
      }],
      toppings: [{
         name: {
            type: String,
         },
         price: {
            type: Number,
         }
      }]
   },
   nutritionalInfo: {
      calories: { type: Number },
      protein: { type: Number },
      fat: { type: Number },
      carbs: { type: Number }
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

export default mongoose.model('Food', foodSchema);