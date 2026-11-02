import product from "../models/product";

//  Create new products 

export const createProducts = async (req, res) => {
    try {
        const product = await product.create(req.body);
        res.json({
            message: 'products created sucessfully',
            product,
        })
    } catch (error) {
        res.status(500).json({ message: 'server Error', error })
    }
}

// Get all products --

export const getProducts = async (req, res) => {
    try {
        const products = await product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
};

// updated a products 

export const updateProducts = async (req, res) => {
    try {
        const updated = await product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
}

// Delete a products 

export const deleteProduct = async (req, res) => {
    try {
        await product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product delete sucessfully' });
    } catch (error) {
        res.status(500).json({ message: 'server error', error });
    }
}