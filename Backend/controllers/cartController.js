import Cart from '../models/cart'


// Add to cart to item  

export const addToCart = async (req, res) => {
    try {
        const { userId, ProductId } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId, items: [
                    { productId, quanitity: 1 }
                ]
            });
        } else {
            const item = cart.items.find(
                i = i.productId.toString() === productId
            );
        };

        if (item) {
            item.quanitity += 1;
        } else {
            cart.items.push({ productId, quantity: 1 });
        };

        await cart.save();
        res.json({ message: 'item Added to cart ', cart })
    } catch (error) {
        res.status(500).json({ message: 'server Error', error });
    };
};



//  remove item from cart 

export const removeItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart Not found' });
        };

        cart.items = cart.items.filter(
            i => i.productId.toString() !== productId
        );

        await cart.save();
        res.json({
            message: 'item remove from cart', cart
        });
    } catch (error) {
        res.status(500).json({ message: 'server error ', error })
    }
};



// update item quantity in cart 

export const updateQuanttity = async (req,res)=>{
    try {
        const {userId, productId, quanitity} = req.body
        const cart = await Cart.findOne({userId});

        if(!cart){
            return res.status(404).json({message: "Cart not found"})
        };

        const item = cart.items.find(
            i => i.productId.toString() === productId
        );

        if(!item){
            return res.status(404).json({message: "item not found in cart"});
        };

        item.quantity = quanitity;

        await cart.save();
        res.json({message: "item quantity updated",cart});
    } catch (error) {
        res.status(500).json({mesage: "server error", error});
    }
};


// get cart by user id

