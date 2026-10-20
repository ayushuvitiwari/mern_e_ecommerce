import product from "../models/product";

//  Create new products 

export const createProducts = async (req, res)=>{
    try {
        const product = await product.create(req.body);
        res.json({
            message: 'products created sucessfully',
            product,
        })
    } catch (error) {
        res.status(500).json({message: 'server Error', error})
    }
}