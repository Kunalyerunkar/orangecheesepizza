import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: function () {
         // Only require firstName if the user is fully registered
         // Don't require it for temporary verification users
         return !this.verificationCode;
      },
      default: 'User', // Default name for temporary users
   },
   lastName: {
      type: String,
      required: false,
   },
   email: {
      type: String,
      required: function () {
         return !this.phoneNumber; // Email is required if no phone number
      },
      sparse: true,
   },
   phoneNumber: {
      type: String,
      required: function () {
         return !this.email; // Phone is required if no email
      },
      unique: true,
      sparse: true,
   },
   password: {
      type: String,
      required: function () {
         return !!this.email; // Password required for email users
      },
   },
   address: {
      type: String,
      required: false,
   },
   isAdmin: {
      type: Boolean,
      default: false,
   },
   verificationCode: {
      code: String,
      expiresAt: Date
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

// Create a partial index on email field that only applies when email is not null
userSchema.index({ email: 1 }, {
   unique: true,
   sparse: true,
   partialFilterExpression: { email: { $type: "string" } }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();

   if (!this.password) return next();

   try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
   } catch (error) {
      next(error);
   }
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
   return await bcrypt.compare(password, this.password);
};

// Virtual for full name
userSchema.virtual('name').get(function () {
   return `${this.firstName} ${this.lastName || ''}`.trim();
});

export default mongoose.model('User', userSchema);