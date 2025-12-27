import Order from "../model/orderModel.js";

// Create new order
export const createOrder = async (req, res) => {
    try {
        const { items, totalPrice, shippingAddress, paymentMethod } = req.body;
        const userId = req.user.userId;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No order items" });
        }

        const order = new Order({
            user: userId,
            items,
            totalPrice,
            shippingAddress,
            paymentMethod: paymentMethod || 'Cash on Delivery'
        });

        const createdOrder = await order.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: createdOrder
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await Order.find({ user: userId })
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error("Get order by ID error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        console.log("📦 getAllOrders called by user:", req.user);
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });

        console.log("📦 Found orders count:", orders.length);
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Valid status transitions for admin
const adminStatusTransitions = {
    'Pending': ['Confirmed', 'Cancelled'],
    'Confirmed': ['Preparing', 'Cancelled'],
    'Preparing': ['Out for Delivery', 'Cancelled'],
    'Out for Delivery': ['Cancelled'], // Only user can mark as Delivered
    'Delivered': [],
    'Cancelled': []
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Validate status transition for admin
        const validTransitions = adminStatusTransitions[order.status] || [];
        if (!validTransitions.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot change status from '${order.status}' to '${status}'. Valid options: ${validTransitions.join(', ') || 'None'}`
            });
        }

        order.status = status;

        if (status === 'Confirmed') {
            order.confirmedAt = Date.now();
        }

        const updatedOrder = await order.save();

        res.json({
            success: true,
            message: `Order ${status.toLowerCase()}`,
            order: updatedOrder
        });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Confirm delivery (User only - when order is Out for Delivery)
export const confirmDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check if user owns the order
        if (order.user.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        // Only allow confirmation if order is Out for Delivery
        if (order.status !== 'Out for Delivery') {
            return res.status(400).json({
                success: false,
                message: "Order can only be confirmed when it's out for delivery"
            });
        }

        order.status = 'Delivered';
        order.deliveredAt = Date.now();
        order.isPaid = true;
        order.paidAt = Date.now();

        const updatedOrder = await order.save();

        res.json({
            success: true,
            message: "Delivery confirmed! Thank you for your order.",
            order: updatedOrder
        });
    } catch (error) {
        console.error("Confirm delivery error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check if user owns the order
        if (order.user.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        // Only allow cancellation if order is still Pending
        if (order.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel order. Order is already being processed."
            });
        }

        order.status = 'Cancelled';
        await order.save();

        res.json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {
        console.error("Cancel order error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete order (Admin only)
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        console.error("Delete order error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get order statistics (Admin only)
export const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        console.error("Get order stats error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
