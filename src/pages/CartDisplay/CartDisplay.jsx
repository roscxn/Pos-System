import React, { useState, useEffect } from "react";

const CartDisplay = ({ cart, setCart }) => {

    const [showCart, setShowCart] = useState([]);

    useEffect(() => {
        fetch("/api/cart")
            .then((response) => response.json())
            .then((data) => {
            setShowCart(data);
            });
    }, [cart]);

    const handleRemove = async (event, cart) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/cart/remove", 
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ _id: cart._id })  
            });
            const data = await response.json();
            console.log(data.message);
            setCart(data);

            if (!response.ok) {
            throw new Error(data.message);
            }
            } catch (error) {
                console.error(error);
              }
          };


    return (
        <div>
            {showCart.length === 0 ? (
                <p>No products in the cart</p>
            ) : (
                <ul>
                    {showCart.map((product) => (
                        <li key={product._id}>
                            <p>{product.name}</p>
                            <p>${product.price}</p>
                            <p>{product.quantityAdded} pc</p>
                            <button className="btn btn-primary" onClick={(event) => handleRemove(event, product)}>Delete</button>
                        </li>
                    ))}
                </ul>
           )}
        </div>
    )
}

export default CartDisplay;