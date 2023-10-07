const Product = require('../models/Product');

const displayProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log('Error fetching product data', error);
        res.status(500).json({ error: 'Error fetching product data' });
    }
}

module.exports = {
    displayProduct,
}