import Cart from "../models/Cart.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

export const placeOrder = async (req, res) => {
    try {
        const { userId, address, addressId } = req.body;
        const shippingAddress = address || addressId;

        // Get cart items
        const userCart = await Cart.findOne({ userId }).populate('items.productId');
        if (!userCart || !userCart.items || userCart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // prepare order items
        const orderItems = userCart.items
            .filter(item => item.productId)
            .map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price,
            }));

        if (orderItems.length === 0) {
            return res.status(400).json({ message: "No valid items in cart" });
        }

        // calculate total amount
        const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

        // deduct stock
        for (let item of orderItems) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }

        // create order
        const newOrder = await Order.create({
            userId,
            items: orderItems,
            address: shippingAddress,
            totalAmount,
            paymentMethod: "COD",
            status: "placed"
        });

        // clear cart
        await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

        res.status(201).json({ message: "Order placed successfully", orderId: newOrder._id });
    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
