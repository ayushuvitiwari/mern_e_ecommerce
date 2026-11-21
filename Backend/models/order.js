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
                },
                price: {
                    type: Number,
                },
            }],

        address: {
            fullName: string,
            address: string,
            city: string,
            state: string,
            pinCode: string,
        },
        totalAmount: Number,
        paymentMethod: {
            type: String,
            default: "COD"
        },
        status: {
            default: "placed",
        },

    }, {
    timestamps: true,
}
);


export default mongoose.model("Order", orderSchema);