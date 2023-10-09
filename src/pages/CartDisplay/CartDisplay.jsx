import React, { useState, useEffect } from "react";

const CartDisplay = ({ 
  addToCart, setAddToCart, 
  quantityValues, setQuantityValues, 
  checkoutSuccess, setCheckoutSuccess, 
  errorMessage, setErrorMessage }) => {

    const [showCart, setShowCart] = useState([]);

    const filteredCart = showCart.filter((cartItem) => quantityValues[cartItem._id] > 0);
    let totalCartPrice = 0;
    filteredCart.forEach((product) => {
      const itemPrice = product.price * quantityValues[product._id];
      totalCartPrice += itemPrice;
    });


    useEffect(() => {   
        fetch("/api/cart")
            .then((response) => response.json())
            .then((data) => {
            setShowCart(data);
            });
    }, [addToCart]);

    const handleQuantityChange = (newQuantity, productId, product) => {
      if (newQuantity >= 0 && newQuantity <= product.inStock) {
        setQuantityValues({
          ...quantityValues,
          [productId]: newQuantity,
        });
    
        if (newQuantity === 0) {
          setShowCart((prevCart) =>
            prevCart.filter((cartItem) => cartItem._id !== productId)
          );
        }
        setErrorMessage("");
      } else {
        setErrorMessage("Invalid quantity");
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
            setAddToCart(data);

            setQuantityValues({
              ...quantityValues,
              [cart._id]: 0,
            });

            setErrorMessage("");
            
            if (!response.ok) {
            throw new Error(data.message);
            }
            } catch (error) {
                console.error(error);
              }
          };

          const handleCheckOut = async (event, cart) => {
            event.preventDefault();
    
            const cartItems = filteredCart.map((cart) => ({
              product: cart._id,
              quantity: quantityValues[cart._id],
              itemPrice: cart.price * quantityValues[cart._id],
            }));
            
            try {
              const response = await fetch("/api/cart/checkout",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                  cartItems: cartItems,
                  totalCartPrice: totalCartPrice,
                }),
                
                }
              )
              if (response.ok) {  

                // Create an object to reset quantities for all cart items to 0
                const resetQuantities = {};
                cartItems.forEach((cartItem) => {
                    resetQuantities[cartItem.product] = 0;
                });

                // Update quantityValues state with the resetQuantities object
                setQuantityValues((prevQuantityValues) => ({
                    ...prevQuantityValues,
                    ...resetQuantities,
                }));
                  
                setShowCart([])
                setCheckoutSuccess(true)
                setErrorMessage("");

              } else {
                const errorData = await response.json();
                const errorMessage = errorData.error;
                setErrorMessage(errorMessage);
            }
        } catch (error) {
            console.error("An expected error occurred:", error);
        }
      }
      
      
    return (
        <>
       
        { showCart.length === 0 ? (<p>No products in cart</p> 
        
        ) : (

        <div className="overflow-x-auto mt-24">
        <table className="table">
          <thead>
            <tr className="hover">
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
                    className="btn btn-outline text-xs w-12 h-auto"
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
                            className="btn btn-outline"
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
  
        <p className="mt-6 text-lg">Total Cart Price: ${totalCartPrice.toFixed(2)}</p>
  
        <button
          className="btn w-full btn-primary mt-3"
          onClick={(event) => handleCheckOut(event, showCart)}
        >
          Check Out
        </button>
      </div>
        )
    }

      { !checkoutSuccess  ? (null
      
      ) : (

        <div className="alert alert-success w-96">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Check out success!</span>
        </div>

            )
        }

      
      {errorMessage && (
        <div className="alert alert-error">
          {errorMessage}
        </div>
      )}

        </>
    
    )};

export default CartDisplay;