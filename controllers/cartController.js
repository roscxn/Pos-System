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
        console.log("removeproduct controller:", productIdToRemove)
        res.json({ message: "Product deleted from cart successfully." });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting product from cart' });
    }
}

// const checkOut = async (req, res) => {
//     try {
//         const cartData = req.session.cart
//         const productsInCart = await Product.find({ _id: { $in: cartData } });

// console.log("CARTDATa:", cartData)
// console.log("productsInCart:", productsInCart)

//         const cartItemAndQuantity = req.body.quantity;

//         console.log("cartitem and quantity:", cartItemAndQuantity)

//         const productIds = [];
//         const productQuantities = [];

//         for (const productId in cartItemAndQuantity) {
//             if (cartItemAndQuantity.hasOwnProperty(productId)) {
//               productIds.push(productId);
//               productQuantities.push(cartItemAndQuantity[productId]);
//             }
//           }
        
//         const cartItems = []
//         cartItems.push({ product: productsInCart._id, quantity: productQuantities});

//         console.log("checkout cart REQ BODY CART ITEMS:", cartItems);

//         const totalCartPrice = req.body.totalCartPrice

//         console.log("total cart price:", totalCartPrice);


//         const newCart = new Cart({
//             cartItems,
//             totalCartPrice
//         });

//         const savedCart = await newCart.save()
//         res.status(201).json(savedCart);

//     } catch (error) {
//         res.status(400).json({ error: 'Error checking out cart' });

//     }
// }

const checkOut = async (req, res) => {
    try {
        const cartData = req.session.cart;
        const productsInCart = await Product.find({ _id: { $in: cartData } });

        console.log("CARTDATa:", cartData);
        console.log("productsInCart:", productsInCart);

        const cartItemAndQuantity = req.body.quantity;

        console.log("cartitem and quantity:", cartItemAndQuantity);

        const productIds = [];
        const productQuantities = [];

        for (const productId in cartItemAndQuantity) {
            if (cartItemAndQuantity.hasOwnProperty(productId)) {
                productIds.push(productId);
                productQuantities.push(cartItemAndQuantity[productId]);
            }
        }

        const cartItems = [];

        // Construct cartItems array with separate objects
        for (let i = 0; i < productIds.length; i++) {
            cartItems.push({ product: productsInCart[i]._id, quantity: productQuantities[i] });
        }

        console.log("checkout cart REQ BODY CART ITEMS:", cartItems);

        const totalCartPrice = req.body.totalCartPrice;

        console.log("total cart price:", totalCartPrice);

        const newCart = new Cart({
            cartItems,
            totalCartPrice
        });

        const savedCart = await newCart.save();
        res.status(201).json(savedCart);

    } catch (error) {
        res.status(400).json({ error: 'Error checking out cart' });
    }
}

  

  

module.exports = {
    addToCart,
    displayCart,
    removeProduct,
    checkOut
}