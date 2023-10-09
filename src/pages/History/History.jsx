import React, { useState, useEffect } from "react";

const History = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch("/api/cart/history")
            .then((response) => response.json())
            .then((data) => {
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTransactions(data);
            });
    }, []);

    const handleDeleteTransaction = async (event, transaction) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/product/deleteTransaction", 
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ _id: transaction._id })  
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            setTransactions((prevTransactions) =>
                prevTransactions.filter((t) => t._id !== transaction._id)
            );
        } catch (error) {
            console.error(error);
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

            <div className="flex items-center justify-center">
                <h1 className="text-2xl mt-12 mb-12">Past Transactions</h1>
            </div>
         
            <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr className="hover">
                        <th>Transaction ID</th>
                        <th>Date and Time</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Product Price</th>
                        <th>Total Cart Price</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{transaction._id}</td>
                            <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                            <td>
                                <ul>
                                    {transaction.cartItems.map((cartItem, index) => (
                                        <li key={index}>
                                            {cartItem.product.name}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {transaction.cartItems.map((cartItem, index) => (
                                        <li key={index}>
                                            {cartItem.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {transaction.cartItems.map((cartItem, index) => (
                                        <li key={index}>
                                            ${cartItem.itemPrice.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>${transaction.totalCartPrice.toFixed(2)}</td>

                            <td>
                            <button
                                className="btn btn-primary text-xs w-12 h-auto"
                                onClick={() =>
                                document.getElementById(`my_modal_${transaction._id}`).showModal()
                                }>
                                x
                            </button>

                            <dialog id={`my_modal_${transaction._id}`} className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">
                                        Delete transaction ID "{transaction._id}"?
                                    </h3>
                                    <div className="modal-action">
                                        <form method="dialog">
                                        <button className="btn">Cancel</button>
                                        <button
                                            className="btn btn-error"
                                            onClick={(event) => handleDeleteTransaction(event, transaction)}
                                            >
                                            Delete
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
            </div>
        </>
    );
};

export default History;
