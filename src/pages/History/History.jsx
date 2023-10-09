import React, { useState, useEffect } from "react";

const History = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch("/api/cart/history")
            .then((response) => response.json())
            .then((data) => {
                // Sort the transactions array in reverse order based on createdAt
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTransactions(data);
            });
    }, []);

    return (
        <>
            <div className="flex items-center justify-center">
            <h1 className="text-xl mt-12 mb-12">Past Transactions</h1>
            </div>
         
            <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr className="hover">
                        <th>Transaction ID</th>
                        <th>Date and Time</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total Product Price</th>
                        <th>Total Cart Price</th>
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
                                            {cartItem.product.name} {/* Display the product name */}
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
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </>
    );
};

export default History;
