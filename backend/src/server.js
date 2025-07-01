import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Import custom middleware
import customCorsMiddleware from './middleware/cors.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import cloudinary config
import { setupCloudinary } from './config/cloudinary.config.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Setup Cloudinary
setupCloudinary();

// Middleware
// Use our custom CORS middleware first
app.use(customCorsMiddleware);
// Keep the regular cors as a fallback
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
   fs.mkdirSync(uploadsDir);
}

// Routes
import foodRoutes from './routes/food.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';
import userRoutes from './routes/user.routes.js';

// Register routes with both /api prefix and direct access
// With /api prefix (for direct frontend access)
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Without /api prefix (for proxy access)
app.use('/users', userRoutes);
app.use('/foods', foodRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
   // Set static folder
   app.use(express.static(path.join(__dirname, '../../frontend/dist')));

   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../../frontend', 'dist', 'index.html'));
   });
}

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/orangecheesepizza';
console.log('Attempting to connect to MongoDB with URI:', MONGO_URI);

mongoose
   .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
   })
   .then(async () => {
      console.log('MongoDB Connected');

      // Drop problematic indexes when server starts
      try {
         const usersCollection = mongoose.connection.collection('users');
         await usersCollection.dropIndexes();
         console.log('Dropped existing indexes from users collection');

         // Recreate indexes as needed
         await usersCollection.createIndex({ phoneNumber: 1 }, { unique: true, sparse: true });
         await usersCollection.createIndex({ email: 1 }, {
            unique: true,
            sparse: true,
            partialFilterExpression: { email: { $type: "string" } }
         });
         console.log('Created new indexes on users collection');
      } catch (indexError) {
         console.error('Error managing indexes:', indexError);
      }
   })
   .catch((err) => {
      console.error('MongoDB Connection Error:');
      console.error(err);
   });

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
   console.log(err.name, err.message);
   server.close(() => {
      process.exit(1);
   });
}); 