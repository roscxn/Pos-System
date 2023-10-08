import React, { useState, useEffect } from "react";
import CartDisplay from '../CartDisplay/CartDisplay';

const ProductDisplay = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const [isItemInCart, setIsItemInCart] = useState(false);

    const [quantityValues, setQuantityValues] = useState({});


// Fetch all products from DB 

    useEffect(() => {
        // Fetch products from the server
        fetch("/api/product/")
        .then((response) => response.json())
        .then((data) => {
            setProducts(data);
    
            // Initialize quantityValues with default values for each product
            const initialQuantityValues = {};
            data.forEach((product) => {
            initialQuantityValues[product._id] = 0; // You can set an initial quantity of 0
            });
            setQuantityValues(initialQuantityValues);
        });
    
        // Fetch cart items and check if products are in the cart
        fetch("/api/cart/")
        .then((response) => response.json())
        .then((data) => {
            const isItemInCart = data.some((item) =>
            products.some((product) => product._id === item._id)
            );
            setIsItemInCart(isItemInCart);
            
        });
    }, []);


      
  
    

    // Add new item to cart or update existing quantity

    const handleAdd = async (event, product) => {
        event.preventDefault();
        try {
            const method = isItemInCart ? "PUT" : "POST";
            const response = await fetch("/api/cart/add", {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: product._id, quantity: quantityValues[product._id] || 0 }), // Use the quantity from the quantityValues object
            });
            if (response.ok && method === "POST") {
                const data = await response.json();
                setCart(data);
                setIsItemInCart(true);

                setQuantityValues({ ...quantityValues, [product._id]: 1 }); // Update the quantity for the added product
                console.log("Added to cart:", data);
            } else if (response.ok && method === "PUT") {
                const data = await response.json();
                setCart(data);
                setQuantityValues({ ...quantityValues, [product._id]: quantityValues[product._id] + 1 }); // Increment the quantity for the existing product
                console.log("Added to cart:", data);
            } else {
                console.error("Unsuccessful:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("An expected error occurred:", error);
        }
    };
    
        return (
    <>

    <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
            <img src="https://ssecomm.s3-ap-southeast-1.amazonaws.com/ads/CSkdbOXIzYXgKk9cYxweFlRklni6Cx.jpg" className="w-full h-48 object-cover" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        </div>
     </div> 
    </div>               

        <div className="flex w-full">
            <div className="grid h-auto flex-grow card rounded-box place-items-center w-2/3"> 

<div className="grid grid-cols-4 gap-6 mt-6 mb-6">

{products.map((product) => (
  <div
    key={product._id}
    className="card card-compact bg-base-100 shadow-xl w-48 h-auto hover:bg-primary"
    onClick={(event) => handleAdd(event, product)}
  >
    <div className="card-body">


      {isItemInCart && quantityValues[product._id] > 0 ? ( // Only display the indicator if quantity is greater than 0
        <div className="indicator">
          <span className="indicator-item badge badge-warning w-auto h-10 text-lg">
            x {quantityValues[product._id]}
          </span>
        </div>
      ) : null}

      <img src={product.image} alt="Product Image" className="w-48 h-36 rounded" />
      <h2 className="card-title text-base">{product.name}</h2>
      <p className="text-base">${product.price.toFixed(2)}</p>
      <p className="text-base">{product.description}</p>
      <p className="text-sm mt-4">In Stock: {product.inStock}</p>
    </div>
  </div>
))}

    </div>
</div>

        <div className="divider divider-horizontal"></div>
        <div className="grid h-96 flex-grow card rounded-box place-items-center w-1/3"> 
        
        <CartDisplay 
            cart={cart} 
            setCart={setCart} 

            isItemInCart={isItemInCart}
            setIsItemInCart={setIsItemInCart}

            quantityValues={quantityValues}
            setQuantityValues={setQuantityValues}

            />
        
        </div>
    </div>  

    </>
    )
}

export default ProductDisplay;