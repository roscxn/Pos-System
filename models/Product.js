const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true,
        unique: true,
    },
    inStock: {
        type: Number,
        min: 0,
        max: 1000,
        required: true,
    },
    price: {
        type: Number,
        min: 1,
        max: 1000,
        required: true,
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
        maxLength: 20,
        required: true,
    },
}, {
    timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);
