import Address from "../models/Address.js";

// save address  
export const saveAddress = async (req, res) => {
    try {
        const address = await Address.create(req.body);
        res.status(201).json({ message: 'Address saved successfully', address });
    } catch (error) {
        console.error("Error saving address:", error);
        res.status(500).json({ message: 'Error saving address', error: error.message });
    }
};

// get addresses
export const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};
