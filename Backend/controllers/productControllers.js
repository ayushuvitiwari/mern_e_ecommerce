import Product from "../models/product.js";

// Create new products 
export const createProducts = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        let filter = {};

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get product by id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Get product by ID error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a product
export const updateProducts = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({ message: 'Product updated successfully', product: updated });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a product 
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
