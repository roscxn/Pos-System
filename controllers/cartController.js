const Product = require('../models/Product');
const Cart = require('../models/Cart');

const addToCart = async (req, res) => {
    try {
        const productToCart = await Product.findById(req.body._id)

        const cartData = req.session.cart || []
        const productsInCart = await Product.find({ _id: { $in: cartData } });

        const isProductInCart = productsInCart.find(
            (item) => item._id.toString() === productToCart._id.toString()
        );

        if (!isProductInCart) {
            cartData.push(productToCart._id);
            res.json({ message: "Product added to cart successfully." });

        } else {
            const selectedQuantity = req.body.quantity || 1; 
                if (selectedQuantity <= 0 || selectedQuantity >= productToCart.inStock) {
                    return res.status(400).json({ error: 'Invalid quantity' });
                } else {
                    res.json({ message: "Update cart quantity" });
                }
        }
        req.session.cart = cartData;

    } catch (error) {
        console.error("Add to cart unsuccessful", error);
        res.status(400).json({ error: 'Add to cart unsuccessful' });
    }
}

const displayCart = async (req, res) => {
    try {
      const cartData = req.session.cart || [];
  
      if (cartData.length === 0) {
        req.session.cart = [];
      }
  
      const productsInCart = await Product.find({ _id: { $in: cartData } });

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

        for (const cartItem of cartCheckOut.cartItems) {
            const product = await Product.findById(cartItem.product);

            if (cartItem.quantity > product.inStock) {
                return res.status(400).json({
                    error: `Not enough stock available for product: ${product.name}`,
                });
            }

            product.inStock -= cartItem.quantity;
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
            path: 'cartItems.product', 
            model: 'Product', 
        });

        res.json(transactions);
    } catch (error) {
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