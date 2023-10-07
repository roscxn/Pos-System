const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
    },        
    name: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true,
        unique: true
    },
    inStock: {
        type: Number,
        min: 0,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    image: { 
        type: String, 
        match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
        maxLength: 200, 
        required: true,
        unique: true,
    },
    description: { 
        type: String,
        minLength: 2,
        maxLength: 10, 
        required: true,
    },
    quantityAdded: {
        type: Number,
        min: 0,
    }
}, {
    timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);