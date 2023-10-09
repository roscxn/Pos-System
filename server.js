const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
require("dotenv").config();
require("./config/database");

const app = express();
const productRouter = require("./routes/productRouter.js")
const cartRouter = require("./routes/cartRouter.js")

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.use(
  session({
    secret: 'possystem', 
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000, // Session expires in 1 hour (in milliseconds)
    },
  })
);

app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

app.get('/api', function(req, res) {
  res.send("Hi!");
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`Express app running on port ${port}`)
});