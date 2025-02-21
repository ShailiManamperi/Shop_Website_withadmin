import React, { useState, useEffect } from "react";
import "../style/finalInvoice.css"; // Ensure this file includes the necessary styles

const FinalInvoice = ({ selectedOrder, setShowModal2, handlePaymentUpdate }) => {
    const invoiceDate = new Date().toLocaleDateString();

    const [paymentType, setPaymentType] = useState(selectedOrder.payStatus);
    const [deliveryStatus, setDeliveryStatus] = useState(selectedOrder.deliveryStatus);
    const [advance, setAdvance] = useState(selectedOrder.advance);
    const [nowPay, setNowPay] = useState(0);

    const calculateTotal = (item) => item.quantity * item.unitPrice;
    const subtotal = selectedOrder.items.reduce((sum, item) => sum + calculateTotal(item), 0);
    const totalAdvance = Number(advance) + Number(nowPay);
    const netTotal = subtotal - Number(selectedOrder.discount);
    const balance = netTotal - totalAdvance;

    useEffect(() => {
        if (balance === 0) {
            setPaymentType('Settled'); // Automatically set payment status to 'Settled' when balance is 0
        }
    }, [balance]);

    const handlePrintAndSubmit = () => {
        handlePaymentUpdate({
            orderId: selectedOrder.orderId,
            paymentType: paymentType,
            deliveryStatus: deliveryStatus,
            previousAdvance: advance,
            addedAdvance: nowPay,
            totalAdvance: totalAdvance,
            netTotal: netTotal,
            balance: balance,
            order: selectedOrder,
        });
        // window.print();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    };

    const handlePaymentTypeChange = (e) => {
        setPaymentType(e.target.value);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content final-invoice">
                <h2 className="invoice-title">Final Invoice</h2>
                <div className="invoice-section">
                    <p><strong>Order ID:</strong> #{selectedOrder.orderId}</p>
                    <p><strong>Order Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
                    <p><strong>Invoice Date:</strong> {invoiceDate}</p>
                    <p><strong>Contact:</strong> {selectedOrder.phoneNumber}</p>
                    <div className="payment-type">
                        <label><strong>Payment Status:</strong></label>
                        <select value={paymentType} onChange={handlePaymentTypeChange}>
                            {/* Conditionally render options based on deliveryStatus */}
                            {deliveryStatus === "Pickup" && (
                                <>
                                    <option value="Settled">Settled</option>
                                    <option value="Credit">Credit</option>
                                </>
                            )}
                            {deliveryStatus === "Delivery" && (
                                <>
                                    <option value="Settled">Settled</option>
                                    <option value="COD">COD</option>
                                    <option value="Credit">Credit</option>
                                </>
                            )}
                            {balance === 0 && <option value="Settled">Settled</option>} {/* Auto-set to Settled if balance is 0 */}
                        </select>
                    </div>
                    <div className="delivery-status">
                        <label><strong>Delivery Status:</strong></label>
                        <p>{selectedOrder.deliveryStatus}</p>
                    </div>
                </div>

                <table className="invoice-table">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>Rs. {item.unitPrice.toFixed(2)}</td>
                            <td>Rs. {calculateTotal(item).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="invoice-summary">
                    <p><strong>Subtotal:</strong> Rs. {subtotal.toFixed(2)}</p>
                    <p><strong>Discount:</strong> Rs. {selectedOrder.discount.toFixed(2)}</p>
                    <p><strong>Net Total:</strong> Rs. {netTotal.toFixed(2)}</p>
                    <p><strong>Previous Advance:</strong> Rs. {advance.toFixed(2)}</p>

                    <div className="invoice-summary-item">
                        <label><strong>Now Paying:</strong></label>
                        <input
                            type="number"
                            value={nowPay}
                            onChange={(e) => setNowPay(e.target.value)}
                        />
                    </div>

                    <p><strong>Total Advance:</strong> Rs. {totalAdvance.toFixed(2)}</p>
                    <p><strong>Balance:</strong> Rs. {balance.toFixed(2)}</p>
                </div>

                <div className="modal-buttons">
                    <button className="print-btn" onClick={handlePrintAndSubmit}>Print</button>
                    <button className="close-btn" onClick={() => setShowModal2(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default FinalInvoice;
