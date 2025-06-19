import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Protect routes - User must be authenticated
const protect = async (req, res, next) => {
   let token;

   // Check if token exists in headers
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      try {
         // Get token from header
         token = req.headers.authorization.split(' ')[1];

         // Verify token
         const decoded = jwt.verify(token, process.env.JWT_SECRET);

         // Check if admin token
         if (decoded.id === 'admin') {
            req.user = { id: 'admin', isAdmin: true };
            return next();
         }

         // Get user from token
         req.user = await User.findById(decoded.id).select('-password');

         next();
      } catch (error) {
         res.status(401).json({ message: 'Not authorized, token failed' });
      }
   }

   if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
   }
};

// Admin only middleware
const admin = (req, res, next) => {
   if (req.user && req.user.isAdmin) {
      next();
   } else {
      res.status(401).json({ message: 'Not authorized as admin' });
   }
};

export { admin, protect };
