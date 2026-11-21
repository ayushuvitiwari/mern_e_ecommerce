import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                price: {
                    type: Number,
                    required: true
                },
            }
        ],
        address: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            default: "COD"
        },
        status: {
            type: String,
            default: "placed",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Order", orderSchema);
