const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    cartItems: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            min: 1,
            required: true,
        }
    }],
    totalCartPrice: {
        type: Number,
        min: 0,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);