import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   phoneNumber: {
      type: String,
      required: true,
      unique: true,
   },
   address: {
      type: String,
      required: false,
   },
   isAdmin: {
      type: Boolean,
      default: false,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();

   try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
   } catch (error) {
      next(error);
   }
});

export default mongoose.model('User', userSchema);