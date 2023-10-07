import React, { useState, useEffect } from "react";
import CartDisplay from '../CartDisplay/CartDisplay';

const ProductDisplay = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
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
                setQuantityValue(quantityValue);
                console.log("Added to cart:", data);

            } else {
                console.error("Unsuccessful:", response.status, response.statusText)
            }
        } catch (error) {
            console.error("An expected error occured:", error);
        }
    }

    // const handleQuantity = (e) => {
    //     let newValue = parseInt(e.target.value, 10);
    
    //     if (!isNaN(newValue)) {
    //       // Ensure the new value is within the allowed range (1 to 10)
    //       if (newValue < 1) {
    //         newValue = 1;
    //       } else if (newValue > 10) {
    //         newValue = 10;
    //       }
    //       setQuantityValue(newValue);
    //     }
    //   };

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

        {/* <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
            <img src="https://ssecomm.s3-ap-southeast-1.amazonaws.com/ads/CSkdbOXIzYXgKk9cYxweFlRklni6Cx.jpg" className="w-full" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        </div>
     </div> 
    </div>                */}

<div className="grid grid-cols-3 gap-6 mt-6 mb-6">
  {products.map((product) => (
    <div key={product._id} className="card card-compact bg-base-100 shadow-xl w-64 h-auto">
        <div className="card-body">
            <img
                src={product.image}
                alt="Product Image"
                className="object-cover w-full h-48 rounded"
                />
            <h2 className="card-title text-lg">{product.name}</h2>
            <p className="text-base">${product.price.toFixed(2)}</p>
            <p className="text-base">{product.description}</p>
            <p className="text-sm mt-4">In Stock: {product.inStock}</p>

            <div className="card-actions">
                    <input
                        type="number"
                        min="1"
                        max="10"
                        defaultValue="1"
                        className="input input-bordered input-primary w-20 h-9"
                    />
                    <button className="btn btn-primary" onClick={(event) => handleAdd(event, product)}>
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
        ))}
    </div>
</div>

        <div className="divider divider-horizontal"></div>
        <div className="grid h-96 flex-grow card rounded-box place-items-center w-1/3"> 
        
        <CartDisplay cart={cart} setCart={setCart} quantityValue={quantityValue}/>
        
        </div>
    </div>  

    </>
    )
}

export default ProductDisplay;