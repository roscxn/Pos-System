import React, { useState, useEffect } from "react";
import CartDisplay from '../CartDisplay/CartDisplay';

const ProductDisplay = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

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
                body: JSON.stringify({ _id: product._id })
            });
           
            if (response.ok) {
                const data = await response.json();
                setCart(data);
                console.log("Added to cart:", data);

            } else {
                console.error("Unsuccessful:", response.status, response.statusText)
            }
        } catch (error) {
            console.error("An expected error occured:", error);
        }
    }

    return (
        <div className="flex w-full">
        <div className="grid h-auto flex-grow card rounded-box place-items-center">

        <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
            <img src="https://ssecomm.s3-ap-southeast-1.amazonaws.com/ads/CSkdbOXIzYXgKk9cYxweFlRklni6Cx.jpg" className="w-full" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        </div>
     </div> 
    </div>               


    <div className="card card-compact w-96 bg-base-100 shadow-xl">
        <div className="card-body">
        <ul>
          {products.map((product) => (
            <li key={product._id}>
                <img src={product.image} alt="Product Image" className="w-full h-full object-cover"/>
                <h2 className="card-title">{product.name}</h2>
                <p>${product.price}</p>
                <p>{product.description}</p>
                <p>Stock: {product.inStock}</p>
            <div className="card-actions">
                {/* <input type="number" value="1" min="1" max="100" step="1"/> */}
                <button className="btn btn-primary" onClick={(event) => handleAdd(event, product)}>Buy Now</button>
            </div>
            </li>
          ))}
        </ul>
        </div>
    </div>
    </div>

        <div className="divider divider-horizontal"></div>
        <div className="grid h-96 flex-grow card rounded-box place-items-center">
        
        <CartDisplay cart={cart} setCart={setCart}/>
        
        </div>
    </div>  
    )
}

export default ProductDisplay;