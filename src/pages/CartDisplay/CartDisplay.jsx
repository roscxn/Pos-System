import React, { useState, useEffect } from "react";

const CartDisplay = ({ cart, setCart, quantityValue, setQuantityValue, setAddedToCart }) => {

    const [showCart, setShowCart] = useState([]);
    // const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        fetch("/api/cart")
            .then((response) => response.json())
            .then((data) => {
            setShowCart(data);
            });
    }, [cart]);


    
    const handleQuantity = (e) => {
        let newValue = parseInt(e.target.value, 10);
      
        if (!isNaN(newValue)) {
          // Ensure the new value is within the allowed range (1 to 10)
          if (newValue < 1) {
            setAddedToCart(false)
            setQuantityValue(0);


            setShowCart([]); // Set addedToCart to false if newValue is less than 1
          } else if (newValue > 10) {
            newValue = 10;
          }
          setQuantityValue(newValue);
        }
      };


    // const handleQuantity = (e, product) => {
    //     let newValue = parseInt(e.target.value, 10);
      
    //     if (!isNaN(newValue)) {
    //       // Ensure the new value is within the allowed range (1 to 10)
    //       if (newValue < 1) {
    //         newValue = 1;
            
    //         setAddedToCart(false); // Set addedToCart to false if newValue is less than 1
    //       } else if (newValue > 10) {
    //         newValue = 10;
    //       }
          
    //       // Update the quantityValue state
    //       setQuantityValue(newValue);
      
    //       // Check if the new value is 0 and remove the product from the cart
    //       if (newValue === 0) {
    //         const updatedCart = cart.filter((item) => item._id !== product._id);
    //         setCart(updatedCart);
    //         setShowCart(updatedCart); // Assuming you have a setShowCart function
    //       }
    //     }
    //   };
      
      


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

            setQuantityValue(0);
            setAddedToCart(false);

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
 <p>Quantity: {quantityValue|| 0}</p>
 <input
     type="number"
     min="0"
     max="10"
     defaultValue="1"
     value={quantityValue}
     onChange={(e) => handleQuantity(e, product)}
     className="input input-bordered input-primary w-20 h-9"
 />

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