import React, { useState } from "react";

const AddProduct = () => {

  const initialFormData = {
    name: "",
    inStock: "",
    price: "",
    image: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);


  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    if ((name === "inStock" || name === "price") && parseFloat(value) <= 0) {
      return; 
    }
  
    setFormData({ 
      ...formData, 
      [name]: value 
    });

  };
  

  const handleSubmitForm =async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('/api/product/add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData(initialFormData); 
        setSubmitMessage("Product added successfully");
    } else {
        const errorResponse = await response.json();
        setSubmitMessage(errorResponse.error || 'Failed to add a new product. Please try again.');
    }
} catch (error) {
    setSubmitMessage("An unexpected error occurred. Please try again later.");
}};


  return (
    
    <div>
      <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
          <img src="https://ssecomm.s3-ap-southeast-1.amazonaws.com/ads/CSkdbOXIzYXgKk9cYxweFlRklni6Cx.jpg" className="w-full h-48 object-cover" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            </div>
          </div> 
      </div> 
      <div className="flex justify-center items-center mt-6">
      <div>
      <h2 className="text-2xl mb-4">Add a Product</h2>
      <form onSubmit={handleSubmitForm}>
        <div>
        <label className="label">
          <span className="label-text">Name</span>
        </label>
          <input
            className="input input-bordered w-full max-w-xs"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            minLength="3"
            maxLength="100"
            required
          />
        </div>
        <div>
        <label className="label">
          <span className="label-text">Stock Quantity</span>
        </label>
          <input
            className="input input-bordered w-full max-w-xs"
            type="number"
            id="inStock"
            name="inStock"
            value={formData.inStock}
            onChange={handleChange}
            min="1"
            max="1000"
            required
          />
        </div>
        <div>
        <label className="label">
          <span className="label-text">Product Price</span>
        </label>
          <input
            className="input input-bordered w-full max-w-xs"
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="1"
            max="1000"
            step="0.1"
            required
          />
        </div>
        <div>
        <label className="label">
          <span className="label-text">Image URL</span>
        </label>
          <input
            className="input input-bordered w-full max-w-xs"
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            maxLength="200" 
            pattern="https?://.+"
            required
          />
        </div>
        <div>
        <label className="label">
          <span className="label-text">Description</span>
        </label>
          <input
            className="input input-bordered w-full max-w-xs"
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            minLength="2"
            maxLength="20"
            required
          />
        </div>
    
        <button className="btn btn-wide btn-primary mt-6" type="submit">Submit</button>
      </form>
      <div className="alert m-12">
        <span className="text-xl">{submitMessage && <p>{submitMessage}</p>}</span>
      </div>
      
    </div>
    </div>
  </div>
  );
};

export default AddProduct;
