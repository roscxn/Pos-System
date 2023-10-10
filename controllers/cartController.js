const Product = require('../models/Product');
const Cart = require('../models/Cart');


const displayCart = async (req, res) => {
  try {
      const cartData = req.session.cart || {};
      const productIds = Object.keys(cartData);

      if (productIds.length === 0) {
          req.session.cart = {};
      }

      const productsInCart = await Product.find({ _id: { $in: productIds } });

      const cartItems = productsInCart.map((product) => ({
          product,
          quantity: cartData[product._id],
      }));

      res.json(cartItems);

  } catch (error) {
      console.error("Error fetching cart data:", error);
      res.status(400).json({ error: 'Error fetching cart data' });
  }
};


const addToCart = async (req, res) => {
    try {
        const productToCart = await Product.findById(req.body._id);

        const cartData = req.session.cart || {}; 
        let selectedQuantity = parseInt(req.body.quantity) || 1; 
        
        if (isNaN(selectedQuantity) || selectedQuantity <= 0 || selectedQuantity >= productToCart.inStock) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }

        if (cartData[productToCart._id] && cartData[productToCart._id] + selectedQuantity > productToCart.inStock) {
          return res.status(400).json({ error: 'Exceeds available stock' });
        }

        if (!cartData[productToCart._id]) {
            cartData[productToCart._id] = selectedQuantity; 
        } else {
            cartData[productToCart._id] += selectedQuantity; 
        }

        req.session.cart = cartData;

        res.json({ message: "Product added to cart successfully." });

    } catch (error) {
        console.error("Add to cart unsuccessful", error);
        res.status(400).json({ error: 'Add to cart unsuccessful' });
    }
};


const reduceQuantity = async (req, res) => {
  try {
    const productToCart = await Product.findById(req.body._id);

    const cartData = req.session.cart || {};
    let selectedQuantity = parseInt(req.body.quantity) || 1;

    if (isNaN(selectedQuantity) || selectedQuantity <= 0 || selectedQuantity > cartData[productToCart._id]) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    if (cartData[productToCart._id]) {
      cartData[productToCart._id] -= selectedQuantity;

      if (cartData[productToCart._id] <= 0) {
        delete cartData[productToCart._id];
      }
    }

    res.json({ message: "Quantity reduced successfully." });
  } catch (error) {
    console.error("Reduce quantity unsuccessful", error);
    res.status(400).json({ error: 'Reduce quantity unsuccessful' });
  }
};


const removeProduct = async (req, res) => {
  try {
      const cartData = req.session.cart || {};
      const productIdToRemove = req.body._id;

      if (cartData.hasOwnProperty(productIdToRemove)) {
          delete cartData[productIdToRemove];
          req.session.cart = cartData;
          res.json({ message: "Product deleted from cart successfully." });
      } else {
          res.status(400).json({ error: 'Product not found in cart.' });
      }
  } catch (error) {
      console.error("Error deleting product from cart:", error);
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

            } else if (cartCheckOut.totalCartPrice <= 0 ) {
                res.status(400).json({ error: 'Invalid Cart Quantity' });     

            } else {
                product.inStock -= cartItem.quantity;
                await product.save();
            }
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
    displayCart,
    addToCart,
    reduceQuantity,
    removeProduct,
    checkOut,
    history,
    
}