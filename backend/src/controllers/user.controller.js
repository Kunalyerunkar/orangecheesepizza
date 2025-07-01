import jwt from 'jsonwebtoken';
import { adminConfig } from '../config/admin.config.js';
import User from '../models/user.model.js';

// Register a new user with email and password
export const registerUser = async (req, res) => {
   try {
      const { firstName, lastName, email, password, phoneNumber, address } = req.body;

      if (!email && !phoneNumber) {
         return res.status(400).json({ message: 'Either email or phone number is required' });
      }

      // Check if user already exists
      const userExists = await User.findOne({
         $or: [
            { email: email || null },
            { phoneNumber: phoneNumber || null }
         ]
      });

      if (userExists) {
         return res.status(400).json({ message: 'User already exists with this email or phone number' });
      }

      // Create new user
      const user = await User.create({
         firstName,
         lastName,
         email,
         password,
         phoneNumber,
         address,
      });

      // Generate token
      const token = jwt.sign({ id: user._id }, adminConfig.jwtSecret, {
         expiresIn: '30d',
      });

      res.status(201).json({
         user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            isAdmin: user.isAdmin,
         },
         token,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// User login with email/password
export const loginUser = async (req, res) => {
   try {
      const { identifier, password } = req.body;

      if (!identifier) {
         return res.status(400).json({ message: 'Email or phone number is required' });
      }

      // Find user by email or phone number
      const user = await User.findOne({
         $or: [{ email: identifier }, { phoneNumber: identifier }]
      });

      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // For email users, check password
      if (user.email === identifier) {
         if (!password) {
            return res.status(400).json({ message: 'Password is required' });
         }

         const isPasswordValid = await user.comparePassword(password);
         if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
         }
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, adminConfig.jwtSecret, {
         expiresIn: '30d',
      });

      res.json({
         user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            isAdmin: user.isAdmin,
         },
         token,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Send verification code
export const sendVerificationCode = async (req, res) => {
   try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
         return res.status(400).json({ message: 'Phone number is required' });
      }

      // Clean and normalize the phone number by removing spaces and other non-digit characters
      // But keep the leading + sign
      const cleanedPhoneNumber = phoneNumber.startsWith('+')
         ? '+' + phoneNumber.substring(1).replace(/\D/g, '')
         : phoneNumber.replace(/\D/g, '');

      console.log(`Original phone: ${phoneNumber}, Cleaned phone: ${cleanedPhoneNumber}`);

      try {
         // Find or create user
         let user = await User.findOne({ phoneNumber: cleanedPhoneNumber });

         if (!user) {
            // Create a new user with just the phone number
            console.log(`Creating new user with phone: ${cleanedPhoneNumber}`);

            // Create user document explicitly setting email to undefined (not null)
            user = new User({
               firstName: 'User', // Temporary name
               phoneNumber: cleanedPhoneNumber,
               email: undefined,  // Explicitly set to undefined instead of null
            });

            try {
               await user.save();
               console.log('New user created successfully');
            } catch (saveError) {
               console.error('Error saving new user:', saveError);
               return res.status(500).json({
                  message: 'Error creating new user',
                  error: saveError.message,
                  stack: saveError.stack
               });
            }
         } else {
            console.log('Existing user found, generating verification code');
         }

         // Generate a 6-digit code
         const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

         // Store code with expiration (10 minutes)
         user.verificationCode = {
            code: verificationCode,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
         };

         try {
            await user.save();
            console.log('Verification code saved to user');
         } catch (saveError) {
            console.error('Error saving verification code:', saveError);
            return res.status(500).json({
               message: 'Error saving verification code',
               error: saveError.message,
               stack: saveError.stack
            });
         }

         // In a real app, you would send this code via SMS
         // For this example, we'll just log it and return success
         console.log(`Verification code for ${cleanedPhoneNumber}: ${verificationCode}`);

         res.json({ message: 'Verification code sent successfully' });
      } catch (userError) {
         console.error("Error creating/updating user:", userError);
         return res.status(500).json({
            message: 'Error creating or updating user',
            error: userError.message,
            stack: userError.stack
         });
      }
   } catch (error) {
      console.error("Error sending verification code:", error);
      res.status(500).json({
         message: 'Server Error',
         error: error.message,
         stack: error.stack
      });
   }
};

// Verify code and login/register with phone
export const verifyCode = async (req, res) => {
   try {
      const { phoneNumber, code } = req.body;

      if (!phoneNumber || !code) {
         return res.status(400).json({ message: 'Phone number and code are required' });
      }

      // Clean and normalize the phone number by removing spaces and other non-digit characters
      // But keep the leading + sign
      const cleanedPhoneNumber = phoneNumber.startsWith('+')
         ? '+' + phoneNumber.substring(1).replace(/\D/g, '')
         : phoneNumber.replace(/\D/g, '');

      console.log(`Original phone: ${phoneNumber}, Cleaned phone: ${cleanedPhoneNumber}, Code: ${code}`);

      // Find user
      const user = await User.findOne({ phoneNumber: cleanedPhoneNumber });
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Check if code exists and is valid
      if (!user.verificationCode || !user.verificationCode.code) {
         return res.status(400).json({ message: 'No verification code found. Please request a new one.' });
      }

      // Check if code has expired
      if (user.verificationCode.expiresAt < new Date()) {
         return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
      }

      // Check if code matches
      if (user.verificationCode.code !== code) {
         return res.status(401).json({ message: 'Invalid verification code' });
      }

      // Clear the verification code
      user.verificationCode = undefined;
      await user.save();

      // Generate token
      const token = jwt.sign({ id: user._id }, adminConfig.jwtSecret, {
         expiresIn: '30d',
      });

      res.json({
         user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            isAdmin: user.isAdmin,
         },
         token,
      });
   } catch (error) {
      console.error("Error verifying code:", error);
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get current user profile (requires authentication)
export const getCurrentUser = async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select('-password -verificationCode');
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Admin login
export const adminLogin = async (req, res) => {
   try {
      const { username, password } = req.body;

      // Check admin credentials against config file values
      if (
         username !== adminConfig.username ||
         password !== adminConfig.password
      ) {
         return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      // Generate token
      const token = jwt.sign(
         {
            id: 'admin',
            isAdmin: true
         },
         adminConfig.jwtSecret,
         { expiresIn: '1d' }
      );

      res.json({
         id: 'admin',
         username: adminConfig.username,
         isAdmin: true,
         token,
      });
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

      const { firstName, lastName, email, phoneNumber, address } = req.body;

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (address) user.address = address;

      const updatedUser = await user.save();

      res.json({
         _id: updatedUser._id,
         firstName: updatedUser.firstName,
         lastName: updatedUser.lastName,
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
      const users = await User.find({}).select('-password -verificationCode');
      res.json(users);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
}; 