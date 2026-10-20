import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
    title : {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: String,
    },
    Image: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0
    },
},{
    timestamps: true
})

export default mongoose.model('product', productsSchema);