import Order from '../models/order.model.js';

// Create new order
export const createOrder = async (req, res) => {
   try {
      const {
         items,
         totalAmount,
         deliveryAddress,
         paymentMethod,
         contactNumber,
      } = req.body;

      // Validate order items
      if (!items || items.length === 0) {
         return res.status(400).json({ message: 'No order items' });
      }

      // Create order
      const order = await Order.create({
         user: req.user.id,
         items,
         totalAmount,
         deliveryAddress,
         paymentMethod,
         contactNumber,
      });

      res.status(201).json(order);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
   try {
      const orders = await Order.find({ user: req.user.id })
         .sort('-orderDate')
         .populate('items.food', 'name image price');

      res.json(orders);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get order by ID
export const getOrderById = async (req, res) => {
   try {
      const order = await Order.findById(req.params.id)
         .populate('user', 'name email phoneNumber')
         .populate('items.food', 'name image price');

      if (!order) {
         return res.status(404).json({ message: 'Order not found' });
      }

      // Check if the order belongs to the logged-in user or if the user is an admin
      if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
         return res.status(403).json({ message: 'Not authorized to access this order' });
      }

      res.json(order);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
   try {
      const { status } = req.body;

      const order = await Order.findById(req.params.id);
      if (!order) {
         return res.status(404).json({ message: 'Order not found' });
      }

      order.status = status;

      // If order is delivered, set the delivery time
      if (status === 'Delivered') {
         order.deliveryTime = Date.now();
      }

      const updatedOrder = await order.save();

      res.json(updatedOrder);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Update payment status (admin only)
export const updatePaymentStatus = async (req, res) => {
   try {
      const { paymentStatus } = req.body;

      const order = await Order.findById(req.params.id);
      if (!order) {
         return res.status(404).json({ message: 'Order not found' });
      }

      order.paymentStatus = paymentStatus;
      const updatedOrder = await order.save();

      res.json(updatedOrder);
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
   try {
      const { status, page = 1, limit = 10 } = req.query;

      const queryObject = {};

      // Filter by status
      if (status && status !== 'All') {
         queryObject.status = status;
      }

      // Create query
      let query = Order.find(queryObject)
         .sort('-orderDate')
         .populate('user', 'name email phoneNumber')
         .populate('items.food', 'name image price');

      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      query = query.skip(skip).limit(Number(limit));

      const orders = await query;
      const totalOrders = await Order.countDocuments(queryObject);

      res.json({
         orders,
         currentPage: Number(page),
         totalPages: Math.ceil(totalOrders / Number(limit)),
         totalItems: totalOrders,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Get order statistics (admin only)
export const getOrderStats = async (req, res) => {
   try {
      const pendingOrders = await Order.countDocuments({ status: 'Pending' });
      const confirmedOrders = await Order.countDocuments({ status: 'Confirmed' });
      const preparingOrders = await Order.countDocuments({ status: 'Preparing' });
      const deliveringOrders = await Order.countDocuments({ status: 'Out for Delivery' });
      const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
      const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

      // Get total revenue
      const totalRevenue = await Order.aggregate([
         { $match: { paymentStatus: 'Completed' } },
         { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      // Get revenue for the last 7 days
      const today = new Date();
      const last7Days = new Date(today.setDate(today.getDate() - 7));

      const recentRevenue = await Order.aggregate([
         { $match: { paymentStatus: 'Completed', orderDate: { $gte: last7Days } } },
         { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      res.json({
         pendingOrders,
         confirmedOrders,
         preparingOrders,
         deliveringOrders,
         deliveredOrders,
         cancelledOrders,
         totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
         recentRevenue: recentRevenue.length > 0 ? recentRevenue[0].total : 0,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
}; 