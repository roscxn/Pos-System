import React, { useState, useEffect } from "react";
import CartDisplay from "../CartDisplay/CartDisplay"

const ProductDisplay = () => {

    const [products, setProducts] = useState([]);
    const [addToCart, setAddToCart] = useState([]);
    const [quantityValues, setQuantityValues] = useState({})
    const [checkoutSuccess, setCheckoutSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
      fetch("/api/product/")
        .then((response) => response.json())
        .then((data) => {
  
          setProducts(data);

        });
    }, []);
    
        const handleAdd = async (event, product) => {
        event.preventDefault();

        if (product.inStock === 0) {
          setErrorMessage("Product is out of stock");
          return;
        }
        try {
            const response = await fetch('/api/cart/addToCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: product._id, quantity: quantityValues }),
            });
            if (response.ok) {
                const data = await response.json();
                setAddToCart(data);
                setCheckoutSuccess(false);
                setErrorMessage("");

                const inStockLeft = product.inStock - quantityValues[product._id];

                if (inStockLeft > 0) {
                    setQuantityValues((prevQuantityValues) => ({
                      ...prevQuantityValues,
                      [product._id]: (prevQuantityValues[product._id] || 0) + 1,
                    }));
                  } 
                } else {
                console.error("Add to cart unsuccessful:", response.status, response.statusText);
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };

    return (
        <>
           <div className="carousel w-full">
              <div id="slide1" className="carousel-item relative w-full">
                  <img src="https://ssecomm.s3-ap-southeast-1.amazonaws.com/ads/CSkdbOXIzYXgKk9cYxweFlRklni6Cx.jpg" className="w-full h-48 object-cover" />
                  <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              </div>
          </div> 
          </div>               

        <div className="flex w-full">
            <div className="grid h-auto flex-grow card rounded-box place-items-center w-1/2"> 

        <div className="grid grid-cols-4 gap-6 mt-6 mb-6">

        {products.map((product) => (
          <div
            key={product._id}
            className="card card-compact bg-base-100 shadow-xl w-48 h-auto hover:bg-primary"
            onClick={(event) => handleAdd(event, product)}
          >
            <div className="card-body">

            {!checkoutSuccess && quantityValues[product._id] > 0 ? (
                <div className="indicator">
                    <span className="indicator-item badge badge-warning w-auto h-10 text-lg">
                    x {quantityValues[product._id]}
                    </span>
                </div>
                ) : null}

              <img src={product.image} alt="Product Image" className="w-48 h-36 rounded" />
              <h2 className="card-title text-base">{product.name}</h2>
              <p className="text-base">${product.price.toFixed(2)}</p>
              <p className="text-base">{product.description}</p>

              {quantityValues[product._id] > 0 ? (
                  <p className="text-sm mt-4">In Stock: {product.inStock - quantityValues[product._id]}</p>
                ) : (
                  <p className="text-sm mt-4">In Stock: {product.inStock}</p>
                )}

            </div>
          </div>
        ))}

            </div>
        </div>

        <div className="divider divider-horizontal"></div>
          <div className="grid h-96 flex-grow card rounded-box place-items-center w-1/3"> 

            <CartDisplay 
                addToCart={addToCart}
                setAddToCart={setAddToCart}

                quantityValues={quantityValues}
                setQuantityValues={setQuantityValues}

                checkoutSuccess={checkoutSuccess}
                setCheckoutSuccess={setCheckoutSuccess}

                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}

                handleAdd={handleAdd}
                />
            </div>
        </div>  

    </>
    )
}

export default ProductDisplay;