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
            // If the product is already in the cart, you can choose to update the quantity or respond with a message
            console.log("add to cart update quantity controller:", req.body)
            res.json({ message: "Product quantity update" });

        }
    } catch (error) {
        console.log("Add to cart unsuccessful", error);
        res.status(400).json({ error: 'Add to cart unsuccessful' });
    }
};

// const displayCart = async (req, res) => {
//     try {
//         const cartData = req.session.cart;
//         const productsInCart = await Product.find({ _id: { $in: cartData } });
//         console.log("displayCart:", productsInCart)
//         res.json(productsInCart);

//     } catch (error) {
//         console.error("Error fetching cart data:", error);
//         res.status(400).json({ error: 'Error fetching cart data' });
//     }
// };

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
      console.log("displayCart:", productsInCart);
  
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
        console.log("removeproduct controller:", productIdToRemove)
        res.json({ message: "Product deleted from cart successfully." });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting product from cart' });
    }
}

module.exports = {
    addToCart,
    displayCart,
    removeProduct,
}