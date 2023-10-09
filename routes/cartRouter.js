const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post('/addToCart', cartController.addToCart);
router.get('/', cartController.displayCart);
router.delete('/remove', cartController.removeProduct);

router.post('/checkout', cartController.checkOut)
// router.delete('/deleteCart', cartController.deleteCart);


router.get('/history', cartController.history)

module.exports = router;