import mongoose from 'mongoose'


const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    items:[
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true
            },
            quantity:{
                type: Number,
                default: 1
            }
        }
    ]
});

export default mongoose.model('Cart', CartSchema);