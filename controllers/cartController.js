const Product = require('../models/Product');
const Cart = require('../models/Cart');

const addToCart = async (req, res) => {
    try {
        const productToCart = await Product.findById(req.body._id)

        // Fetch products currently in the cart

        const cartData = req.session.cart;
        const productsInCart = await Product.find({ _id: { $in: cartData } });

        // Check if the product is already in the cart
        const existingCartItem = productsInCart.find(
            (item) => item._id.toString() === productToCart._id.toString()
        );

        if (!existingCartItem) {
            // If the product is not in the cart, add it with the selected quantity
            req.session.cart = req.session.cart || [];
            req.session.cart.push(productToCart._id);
            res.json({ message: "Product added to cart successfully." });

        } else {

        // Check if the selected quantity is valid
        const selectedQuantity = req.body.quantity || 1; // Default to 1 if quantity is not provided
            if (selectedQuantity <= 0 || selectedQuantity >= productToCart.inStock) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }   else {
            res.json({ message: "Product quantity update" });
        }
        }
    } catch (error) {
        console.log("Add to cart unsuccessful", error);
        res.status(400).json({ error: 'Add to cart unsuccessful' });
    }
};

const displayCart = async (req, res) => {
    try {
      // Fetch the cart data from the session
      const cartData = req.session.cart || [];
  
      // If there is no cart data in the session, clear it
      if (cartData.length === 0) {
        req.session.cart = [];
      }
  
      // Fetch the products in the cart based on the cartData
      const productsInCart = await Product.find({ _id: { $in: cartData } });

      // Send the products in the cart to the client
      res.json(productsInCart);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      res.status(400).json({ error: 'Error fetching cart data' });
    }
  };

const removeProduct = async (req, res) => {
    try {
        const productIdToRemove = req.body._id;
        req.session.cart = req.session.cart.filter((productId) => productId !== productIdToRemove);
        res.json({ message: "Product deleted from cart successfully." });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting product from cart' });
    }
}

const checkOut = async (req, res) => {
    try {
        const cartCheckOut = req.body;

        // Retrieve each cart item and update product stock
        for (const cartItem of cartCheckOut.cartItems) {
            const product = await Product.findById(cartItem.product);

            // Check if the requested quantity is greater than available stock
            if (cartItem.quantity > product.inStock) {
                return res.status(400).json({
                    error: `Not enough stock available for product: ${product.name}`,
                });
            }

            // Update product stock by subtracting the purchased quantity
            product.inStock -= cartItem.quantity;

            // Save the updated product information
            await product.save();
        }

        const newCart = new Cart({
            cartItems: cartCheckOut.cartItems,
            totalCartPrice: cartCheckOut.totalCartPrice,
        });

        const savedCart = await newCart.save();

        req.session.cart = [];

        res.status(201).json(savedCart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error checking out cart' });
    }
};


const history = async (req, res) => {
    try {
        // Use populate to populate the 'product' field in cartItems
        const transactions = await Cart.find().populate({
            path: 'cartItems.product', // 'cartItems.product' should match the field name in your cartSchema
            model: 'Product', // 'Product' should match the model name for your product schema
        });

        res.json(transactions);
    } catch (error) {
        console.log('Error fetching past transactions', error);
        res.status(500).json({ error: 'Error fetching past transactions' });
    }
}

module.exports = {
    addToCart,
    displayCart,
    removeProduct,
    checkOut,
    history
}