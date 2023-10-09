const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js")

router.get('/', productController.displayProduct)
router.post('/add', productController.addNewProduct)
router.delete('/deleteTransaction', productController.deleteTransaction)

module.exports = router;