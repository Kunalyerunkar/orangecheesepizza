import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

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

app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

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
mongoose
   .connect(process.env.MONGO_URI)
   .then(() => console.log('MongoDB Connected'))
   .catch((err) => console.log('MongoDB Connection Error:', err));

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