import React, { useState, useEffect } from "react";

const CartDisplay = ({ cart, setCart, isItemInCart, setIsItemInCart, quantityValues, setQuantityValues }) => {

    const [showCart, setShowCart] = useState([]);


    useEffect(() => {
      fetch("/api/cart")
          .then((response) => response.json())
          .then((data) => {
              setShowCart(data);
          });
  }, [cart]);



  const handleQuantityChange = (newQuantity, productId) => {
    // Ensure the new quantity is within the allowed range (0 to 10)
    if (newQuantity >= 0 && newQuantity <= 10) {
      // Update the quantityValues state for the specific product ID
      setQuantityValues({
        ...quantityValues,
        [productId]: newQuantity,
      });
      // Check if the new quantity is 0 and remove the item from the cart
      if (newQuantity === 0) {
        setIsItemInCart({ ...isItemInCart, [productId]: false });
      }
    }
  };
  
    const handleRemove = async (event, cart) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/cart/remove", 
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ _id: cart._id, quantity: quantityValues[cart._id] })  
            });
            const data = await response.json();
            console.log(data.message);
            setCart(data);

            setQuantityValues({
              ...quantityValues,
              [cart._id]: 0,
            });
            
            setIsItemInCart({ ...isItemInCart, [cart._id]: false });

            if (!response.ok) {
            throw new Error(data.message);
            }
            } catch (error) {
                console.error(error);
              }
          };

    
    const filteredCart = showCart.filter((cartItem) => quantityValues[cartItem._id] > 0);
    let totalCartPrice = 0;
    filteredCart.forEach((product) => {
      const itemPrice = product.price * quantityValues[product._id];
      totalCartPrice += itemPrice;
    });

    return (
        <div>
            {filteredCart.length === 0 ? (
                <p>No products in the cart</p>
            ) : (
                <ul>
                    {filteredCart.map((product) => (
 <li key={product._id}>
 <p>{product.name}</p>

 <p>Total item price: ${(product.price * quantityValues[product._id]).toFixed(2)}</p>

Qty:  <input
     type="number"
     min="0"
     max="10"
     value={quantityValues[product._id]}
     onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10), product._id)}

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

      <p>Total Cart Price: ${totalCartPrice.toFixed(2)}</p>

            </ul> 

           )}
        </div>
    )
}

export default CartDisplay;