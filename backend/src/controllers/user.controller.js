import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Register a new user
export const registerUser = async (req, res) => {
   try {
      const { name, email, phoneNumber, address } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
      if (userExists) {
         return res.status(400).json({ message: 'User already exists with this email or phone number' });
      }

      // Create new user
      const user = await User.create({
         name,
         email,
         phoneNumber,
         address,
      });

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: '30d',
      });

      res.status(201).json({
         _id: user._id,
         name: user.name,
         email: user.email,
         phoneNumber: user.phoneNumber,
         address: user.address,
         isAdmin: user.isAdmin,
         token,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// User login
export const loginUser = async (req, res) => {
   try {
      const { phoneNumber } = req.body;

      // Find user by phone number
      const user = await User.findOne({ phoneNumber });
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: '30d',
      });

      res.json({
         _id: user._id,
         name: user.name,
         email: user.email,
         phoneNumber: user.phoneNumber,
         address: user.address,
         isAdmin: user.isAdmin,
         token,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Admin login
export const adminLogin = async (req, res) => {
   try {
      const { username, password } = req.body;

      // Check admin credentials
      if (
         username !== process.env.ADMIN_USERNAME ||
         password !== process.env.ADMIN_PASSWORD
      ) {
         return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      // Generate token
      const token = jwt.sign(
         {
            id: 'admin',
            isAdmin: true
         },
         process.env.JWT_SECRET,
         { expiresIn: '1d' }
      );

      res.json({
         id: 'admin',
         username: process.env.ADMIN_USERNAME,
         isAdmin: true,
         token,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get user profile
export const getUserProfile = async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
   try {
      const user = await User.findById(req.user.id);
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      const { name, email, phoneNumber, address } = req.body;

      if (name) user.name = name;
      if (email) user.email = email;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (address) user.address = address;

      const updatedUser = await user.save();

      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         phoneNumber: updatedUser.phoneNumber,
         address: updatedUser.address,
         isAdmin: updatedUser.isAdmin,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get all users (admin only)
export const getUsers = async (req, res) => {
   try {
      const users = await User.find({}).select('-password');
      res.json(users);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
}; 