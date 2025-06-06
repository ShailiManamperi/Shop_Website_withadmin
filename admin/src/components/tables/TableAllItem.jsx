import React, { useState, useEffect } from "react";
import "../../style/TableTwo.css"; // Import the stylesheet
import { useNavigate } from "react-router-dom";

const TableAllItem = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]); // Stores search results
    const [searchQuery, setSearchQuery] = useState(""); // Search input state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    // Fetch all items from API
    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/allitems");
            const data = await response.json();

            if (data.length > 0) {
                setItems(data);
                setFilteredItems(data); // Initialize filtered list
            } else {
                setItems([]);
                setFilteredItems([]);
                setError("No items available.");
            }
        } catch (error) {
            setItems([]);
            setFilteredItems([]);
            setError("Error fetching items.");
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to navigate to item details page
    const handleViewItem = (itemId) => {
        navigate(`/item-detail/${itemId}`);
    };

    // Handle search filter (by Item ID or Item Name)
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = items.filter(
            (item) =>
                item.I_Id.toString().toLowerCase().includes(query) || // Match Item ID
                item.I_name.toLowerCase().includes(query) // Match Item Name
        );

        setFilteredItems(filteredData);
    };

    return (
        <div className="table-container">
            <h4 className="table-title">All Items</h4>

            {/* 🔍 Search Box */}
            <input
                type="text"
                placeholder="Search by Item ID or Name..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
            />

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Item Id</th>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>All Quantity</th>
                        <th>Available Quantity</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="8" className="loading-text text-center">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="8" className="error-text text-center">{error}</td>
                        </tr>
                    ) : filteredItems.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="no-items-message text-center">No items found</td>
                        </tr>
                    ) : (
                        filteredItems.map((item) => (
                            <tr key={item.I_Id}>
                                <td>
                                    <img
                                        src={item.img}
                                        alt={item.I_name}
                                        className="product-image"
                                    />
                                </td>
                                <td>{item.I_Id}</td>
                                <td>{item.I_name}</td>
                                <td>Rs.{item.price}</td>
                                <td>{item.stockQty}</td>
                                <td>{item.availableQty}</td>
                                <td>{item.descrip}</td>
                                <td className="action-buttons">
                                    <button
                                        className="view-btn"
                                        onClick={() => handleViewItem(item.I_Id)}
                                    >
                                        👁️
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableAllItem;
