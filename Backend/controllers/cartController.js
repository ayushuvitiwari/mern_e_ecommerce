import Cart from '../models/Cart.js';

// Add to cart to item  
export const addToCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity: 1 }]
            });
        } else {
            const item = cart.items.find(
                i => i.productId && i.productId.toString() === productId
            );

            if (item) {
                item.quantity += 1;
            } else {
                cart.items.push({ productId, quantity: 1 });
            }
        }

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.productId');
        res.json({ message: 'Item added to cart', cart: populatedCart });
    } catch (error) {
        console.error("Cart add error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Remove item from cart 
export const removeItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            i => i.productId && i.productId.toString() !== productId
        );

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.productId');
        res.json({ message: 'Item removed from cart', cart: populatedCart });
    } catch (error) {
        console.error("Cart remove error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update item quantity in cart 
export const updateQuanttity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            i => i.productId && i.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = Number(quantity);

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.productId');
        res.json({ message: "Item quantity updated", cart: populatedCart });
    } catch (error) {
        console.error("Cart update error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get cart by user id
export const getCart = async (req, res) => {
    try {
        const userId = req.params.userId || req.params.userid;
        let cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            cart = { userId, items: [] };
        }
        res.json(cart);
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
