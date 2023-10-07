const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post('/add', cartController.addToCart);
router.get('/', cartController.displayCart);
router.delete('/remove', cartController.removeProduct);

module.exports = router;