const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get('/', cartController.displayCart);
router.get('/history', cartController.history)
router.post('/addToCart', cartController.addToCart);
router.post('/checkout', cartController.checkOut)
router.delete('/remove', cartController.removeProduct);

module.exports = router;