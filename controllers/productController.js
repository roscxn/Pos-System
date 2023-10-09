const Product = require('../models/Product');
const Cart = require('../models/Cart');

const displayProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product data' });
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const transactionId = req.body._id;
        const deletedTransaction = await Cart.findByIdAndRemove(transactionId);

        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: "Transaction has been deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting transaction' });
    }
}

const addNewProduct = async (req, res) => {
    const { name, inStock, price, image, description } = req.body;
  
    try {
      const nameExists = await Product.findOne({ name });
      const imageExists = await Product.findOne({ image });
  
      if (nameExists) {
        return res.status(400).json({ error: 'Product with the same name already exists' });

      } else if (imageExists) {
        return res.status(400).json({ error: 'Product with the same image URL already exists' });

      } else {
  
        const newProduct = new Product({
            name,
            inStock,
            price,
            image,
            description,
        });
  
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error adding new product' });
    }
  };
  

module.exports = {
    displayProduct,
    deleteTransaction,
    addNewProduct
}