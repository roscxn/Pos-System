import React, { useState, useEffect } from "react";

const CartDisplay = ({ cart, setCart, quantityValue }) => {

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

                            <p>Quantity selected: {quantityValue}</p>


   {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button
                className="btn btn-primary"
                onClick={() => document.getElementById(`my_modal_${product._id}`).showModal()}
                >
                Remove
                </button>
                <dialog id={`my_modal_${product._id}`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Remove "{product.name}" from cart?</h3>
                    <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Cancel</button>
                        <button
                        className="btn btn-error"
                        onClick={(event) => handleRemove(event, product)}
                        >
                        Remove
                        </button>
                    </form>
                    </div>
                </div>
                </dialog>
                </li>
                ))}
            </ul>
           )}
        </div>
    )
}

export default CartDisplay;