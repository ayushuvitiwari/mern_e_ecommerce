import order from "../models/order";
import cart from "../models/cart";
import product from "../models/product";


export const placeOrder = async (req, res) => {
    try {
        const { userId, address } = req.body;

        //  Get cart item 
        const Cart = await cart.findOne({ userId }).populate('items.productId');
        if (!Cart || Cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // prepare order items

        const orderItems = Cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
        }));

        // calculate total amount

        const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

        // deduct stock

        for (let item of cart.items) {
            await product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
        }
        //    create order
        const Order = await Order.create({
            userId,
            items: orderItems,
            address,
            totalAmount,
            paymentMethod: "COD",
        });

        //    clear cart
        await cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
        res.status(201).json({ message: "Order placed successfully", orderId: Order._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }   