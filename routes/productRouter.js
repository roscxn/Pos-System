const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js")

router.get('/', productController.displayProduct)

module.exports = router;