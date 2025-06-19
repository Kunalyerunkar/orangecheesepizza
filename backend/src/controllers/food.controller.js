import { cloudinary } from '../config/cloudinary.config.js';
import Food from '../models/food.model.js';

// Get all food items
export const getAllFoods = async (req, res) => {
   try {
      const { category, search, sort, limit = 10, page = 1 } = req.query;

      const queryObject = {};

      // Filter by category
      if (category && category !== 'All') {
         queryObject.category = category;
      }

      // Search by name
      if (search) {
         queryObject.name = { $regex: search, $options: 'i' };
      }

      // Create query
      let query = Food.find(queryObject);

      // Sort
      if (sort) {
         const sortList = sort.split(',').join(' ');
         query = query.sort(sortList);
      } else {
         query = query.sort('createdAt');
      }

      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      query = query.skip(skip).limit(Number(limit));

      const foods = await query;
      const totalFoods = await Food.countDocuments(queryObject);

      res.json({
         foods,
         currentPage: Number(page),
         totalPages: Math.ceil(totalFoods / Number(limit)),
         totalItems: totalFoods,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get food by ID
export const getFoodById = async (req, res) => {
   try {
      const food = await Food.findById(req.params.id);
      if (!food) {
         return res.status(404).json({ message: 'Food not found' });
      }
      res.json(food);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Create new food item (admin only)
export const createFood = async (req, res) => {
   try {
      const {
         name,
         description,
         price,
         category,
         ingredients,
         specialOffer,
         customizationOptions,
         nutritionalInfo,
      } = req.body;

      // Upload image to cloudinary
      let imageUrl = '';
      if (req.file) {
         const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'orangecheesepizza',
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
         });
         imageUrl = result.secure_url;
      }

      const food = await Food.create({
         name,
         description,
         price,
         image: imageUrl,
         category,
         ingredients: ingredients ? JSON.parse(ingredients) : [],
         specialOffer: specialOffer === 'true',
         customizationOptions: customizationOptions ? JSON.parse(customizationOptions) : {},
         nutritionalInfo: nutritionalInfo ? JSON.parse(nutritionalInfo) : {},
      });

      res.status(201).json(food);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Update food item (admin only)
export const updateFood = async (req, res) => {
   try {
      const {
         name,
         description,
         price,
         category,
         ingredients,
         specialOffer,
         customizationOptions,
         nutritionalInfo,
         isAvailable,
         isFeatured,
      } = req.body;

      let food = await Food.findById(req.params.id);
      if (!food) {
         return res.status(404).json({ message: 'Food not found' });
      }

      // Upload new image if provided
      let imageUrl = food.image;
      if (req.file) {
         const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'orangecheesepizza',
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
         });
         imageUrl = result.secure_url;
      }

      // Update food item
      const updatedFood = await Food.findByIdAndUpdate(
         req.params.id,
         {
            name: name || food.name,
            description: description || food.description,
            price: price || food.price,
            image: imageUrl,
            category: category || food.category,
            ingredients: ingredients ? JSON.parse(ingredients) : food.ingredients,
            specialOffer: specialOffer !== undefined ? specialOffer === 'true' : food.specialOffer,
            customizationOptions: customizationOptions
               ? JSON.parse(customizationOptions)
               : food.customizationOptions,
            nutritionalInfo: nutritionalInfo
               ? JSON.parse(nutritionalInfo)
               : food.nutritionalInfo,
            isAvailable: isAvailable !== undefined ? isAvailable === 'true' : food.isAvailable,
            isFeatured: isFeatured !== undefined ? isFeatured === 'true' : food.isFeatured,
         },
         { new: true }
      );

      res.json(updatedFood);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Delete food item (admin only)
export const deleteFood = async (req, res) => {
   try {
      const food = await Food.findById(req.params.id);
      if (!food) {
         return res.status(404).json({ message: 'Food not found' });
      }

      await food.remove();
      res.json({ message: 'Food removed' });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get featured food items
export const getFeaturedFoods = async (req, res) => {
   try {
      const foods = await Food.find({ isFeatured: true }).limit(8);
      res.json(foods);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get special offers
export const getSpecialOffers = async (req, res) => {
   try {
      const foods = await Food.find({ specialOffer: true });
      res.json(foods);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
}; 