import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   items: [
      {
         food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
            required: true,
         },
         quantity: {
            type: Number,
            required: true,
            min: 1,
         },
         price: {
            type: Number,
            required: true,
         },
         customizations: {
            size: {
               name: String,
               price: Number,
            },
            crust: {
               name: String,
               price: Number,
            },
            toppings: [
               {
                  name: String,
                  price: Number,
               },
            ],
         },
         specialInstructions: {
            type: String,
         },
      },
   ],
   totalAmount: {
      type: Number,
      required: true,
   },
   deliveryAddress: {
      type: String,
      required: true,
   },
   status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
   },
   paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Online Payment'],
      required: true,
   },
   paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
   },
   orderDate: {
      type: Date,
      default: Date.now,
   },
   deliveryTime: {
      type: Date,
   },
   contactNumber: {
      type: String,
      required: true,
   },
});

export default mongoose.model('Order', orderSchema);