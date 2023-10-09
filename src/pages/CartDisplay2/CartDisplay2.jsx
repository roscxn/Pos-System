import React, { useState, useEffect } from "react";

const CartDisplay2 = ({ addToCart, setAddToCart, quantityValues, setQuantityValues }) => {

    const [showCart, setShowCart] = useState([]);

    useEffect(() => {   
        fetch("/api/cart")
            .then((response) => response.json())
            .then((data) => {
            setShowCart(data);
            });
    }, [addToCart]);

    const handleQuantityChange = (newQuantity, productId, product) => {
        // Ensure the new quantity is within the allowed range (0 to 10)
    
        if (newQuantity >= 0 && newQuantity <= product.inStock) {
    
          // Update the quantityValues state for the specific product ID
          setQuantityValues({
            ...quantityValues,
            [productId]: newQuantity,
          });
          // Check if the new quantity is 0 and remove the item from the cart
            if (newQuantity === 0) {
                    setShowCart((prevCart) =>
                    prevCart.filter((cartItem) => cartItem._id !== productId) 
                );
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
            setAddToCart(data);

            setQuantityValues({
              ...quantityValues,
              [cart._id]: 0,
            });
            
            // setIsItemInCart({ ...isItemInCart, [cart._id]: false });

            if (!response.ok) {
            throw new Error(data.message);
            }
            } catch (error) {
                console.error(error);
              }
          };

    return (
        <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>In Stock</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {showCart.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                

                <td>${(product.price * quantityValues[product._id]).toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={product.inStock}
                    value={quantityValues[product._id]}
                    onChange={(e) =>
                      handleQuantityChange(
                        parseInt(e.target.value),
                        product._id,
                        product
                      )
                    }
                    className="input input-bordered input-primary w-20 h-9"
                  />
                </td>

                <td>{product.inStock - quantityValues[product._id]}</td>
                <td>
                  <button
                    className="btn btn-primary text-sm w-12 h-12"
                    onClick={() =>
                      document.getElementById(`my_modal_${product._id}`).showModal()
                    }
                  >
                    x
                  </button>
                  <dialog id={`my_modal_${product._id}`} className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">
                        Remove "{product.name}" from cart?
                      </h3>
                      <div className="modal-action">
                        <form method="dialog">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* <p>Total Cart Price: ${totalCartPrice.toFixed(2)}</p> */}
  
        <button
          className="btn btn-error"
        //   onClick={(event) => handleCheckOut(event, cart)}
        >
          Check Out
        </button>
      </div>
    )
}

export default CartDisplay2