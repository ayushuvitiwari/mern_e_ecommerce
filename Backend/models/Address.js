import mongoose from 'mongoose';

const addressScheam = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref:'User'

    },
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pinCode: String

},{
    timestamps: true
});


export default mongoose.model('Address', addressScheam);