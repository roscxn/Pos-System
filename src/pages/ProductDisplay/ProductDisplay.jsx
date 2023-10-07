import React, { useState, useEffect } from "react";
import CartDisplay from '../CartDisplay/CartDisplay';

const ProductDisplay = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const [addedToCart, setAddedToCart] = useState(false);


    const [quantityValue, setQuantityValue] = useState(1);


    useEffect(() => {
        fetch("/api/product/")
            .then((response) => response.json())
            .then((data) => {
            setProducts(data);
            });
    }, []);

    const handleAdd = async (event, product) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/cart/add", 
            { 
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: product._id, quantity: quantityValue })
            });
           
            if (response.ok) {
                const data = await response.json();
                setCart(data);
                setQuantityValue(parseInt(quantityValue) + 1);
                setAddedToCart(true);
                console.log("Added to cart:", data);
            } else {
                console.error("Unsuccessful:", response.status, response.statusText)
            }
        } catch (error) {
            console.error("An expected error occurred:", error);
        }
    }

    


    return (
    <>

    <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
            <img src="https://ssecomm.s3-ap-southeast-1.amazonaws.com/ads/CSkdbOXIzYXgKk9cYxweFlRklni6Cx.jpg" className="w-full" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        </div>
     </div> 
    </div>               

        <div className="flex w-full">
            <div className="grid h-auto flex-grow card rounded-box place-items-center w-2/3"> 

<div className="grid grid-cols-4 gap-6 mt-6 mb-6">
  {products.map((product) => (
    <div key={product._id} 
        className="card card-compact bg-base-100 shadow-xl w-48 h-auto hover:bg-primary"
        onClick={(event) => handleAdd(event, product)}
        >
        <div className="card-body">

        {addedToCart ? (
  <div className="indicator">
    <span className="indicator-item badge badge-warning w-auto h-10 text-lg">
      x {quantityValue}
    </span>
  </div>
) : null}

            
            <img
                src={product.image}
                alt="Product Image"
                className="w-48 h-36 rounded"
                />
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

            quantityValue={quantityValue} 
            setQuantityValue={setQuantityValue}
            setAddedToCart={setAddedToCart}
            />
        
        </div>
    </div>  

    </>
    )
}

export default ProductDisplay;