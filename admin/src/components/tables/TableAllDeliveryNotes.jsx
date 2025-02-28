import React, { useState, useEffect } from "react";
import "../../style/TableTwo.css"; // Import the stylesheet
import { useNavigate } from "react-router-dom";

const TableAllDeliveryNotes= () => {
    const [deliverynotes, setDeliverynotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        fetchNotes();
    }, []);

    // Fetch all items from API
    const fetchNotes = async () => {
        setLoading(true); // Start loading state

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/alldeliverynotes");
            const data = await response.json();

            if (data.length > 0) {
                setDeliverynotes(data); // Store fetched items
            } else {
                setDeliverynotes([]); // Set empty array
                setError("No deliveries available."); // Show "No items" message
            }
        } catch (error) {
            setDeliverynotes([]); // Ensure items array is empty on error
            setError("Error fetching deliveries.");
            console.error("Error fetching deliveries:", error);
        } finally {
            setLoading(false); // Stop loading state
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };
    return (
        <div className="table-container">
            <h4 className="table-title">All Deliveries</h4>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Delivery NoteId</th>
                        <th>Delivery Date</th>
                        <th>Driver Name</th>
                        <th>District</th>
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
                    ) : deliverynotes.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="no-items-message text-center">No items found</td>
                        </tr>
                    ) : (
                        deliverynotes.map((delivery) => (
                            <tr key={delivery.delNoID}>
                                <td>{delivery.delNoID}</td>
                                <td>{formatDate(delivery.date)}</td>
                                <td>{delivery.driverName}</td>
                                <td>{delivery.district}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableAllDeliveryNotes;
