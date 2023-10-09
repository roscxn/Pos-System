import React, { useState, useEffect } from "react";

const CartDisplay = ({ cart, setCart, isItemInCart, setIsItemInCart, quantityValues, setQuantityValues, checkoutSuccess, setCheckoutSuccess}) => {

    const [showCart, setShowCart] = useState([]);

    useEffect(() => {
      fetch("/api/cart")
          .then((response) => response.json())
          .then((data) => {
              setShowCart(data);
          });
  }, [cart]);


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


      const handleCheckOut = async (event,) => {
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
            const data = await response.json();
            setCart(data);
            setCheckoutSuccess(true);

            setQuantityValues({});
            setIsItemInCart({})
            

            // setQuantityValues({
            //   ...quantityValues,
            //   [cart._id]: 0,
            // });
            
            // setIsItemInCart({ ...isItemInCart, [cart._id]: false });

            // window.location.reload();

            
          } else {
            console.error("Unsuccessful:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("An expected error occurred:", error);
    }
  }
    
    return (
<div>
  {checkoutSuccess && filteredCart.length <= 0 ? (
    <div className="alert alert-success">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Check out success!</span>
    </div>
  ) : null}

{!checkoutSuccess && filteredCart.length > 0 ? (
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
          {filteredCart.map((product) => (
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

      <p>Total Cart Price: ${totalCartPrice.toFixed(2)}</p>

      <button
        className="btn btn-error"
        onClick={(event) => handleCheckOut(event, cart)}
      >
        Check Out
      </button>
    </div>
  ) : <p>No products in cart</p>}
</div>

    )
  }

export default CartDisplay;


// {filteredCart.map((product) => (
//   <li key={product._id}>
//       <p>{product.name}</p>

//       <p>Total item price: ${(product.price * quantityValues[product._id]).toFixed(2)}</p>

//       Qty:  <input
//           type="number"
//           min="0"
//           max={product.inStock} 
//           value={quantityValues[product._id]}
//           onChange={(e) => handleQuantityChange(parseInt(e.target.value), product._id, product)}
//           className="input input-bordered input-primary w-20 h-9"
//       />
//           <p>In Stock: {product.inStock - quantityValues[product._id]}</p> 


//    <button
//       className="btn btn-primary"
//       onClick={() => document.getElementById(`my_modal_${product._id}`).showModal()}
//       >
//       Remove
//       </button>
//       <dialog id={`my_modal_${product._id}`} className="modal">
//       <div className="modal-box">
//           <h3 className="font-bold text-lg">Remove "{product.name}" from cart?</h3>
//           <div className="modal-action">
//           <form method="dialog">
//               <button className="btn">Cancel</button>
//               <button
//               className="btn btn-error"
//               onClick={(event) => handleRemove(event, product)}
//               >
//               Remove
//               </button>
//           </form>
//           </div>
//       </div>
//       </dialog>
//       </li>
//       ))}