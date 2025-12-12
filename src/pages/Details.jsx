import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function Details() {
    const location = useLocation();
    const navigate = useNavigate();
    const { myrAmount, usdAmount, fee, total, rate } = location.state || {};

    // Form State
    const [formData, setFormData] = useState({
        senderName: '',
        senderContact: '',
        payMethod: 'Mobile Wallet', // Default
        receiverName: '',
        receiverAccount: ''
    });

    // Redirect if no state
    useEffect(() => {
        if (!location.state) {
            navigate('/');
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.senderName || !formData.receiverName || !formData.receiverAccount) {
            alert("Please fill in all required fields");
            return;
        }

        // Generate Transaction ID and Timestamp
        const transactionId = "AM" + Math.floor(100000 + Math.random() * 900000); // AM123456
        const timestamp = new Date().toLocaleString();

        navigate('/invoice', {
            state: {
                ...location.state,
                ...formData,
                transactionId,
                timestamp
            }
        });
    };

    if (!location.state) return null;

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', padding: 0, marginRight: '1rem' }}>
                        <ArrowLeft />
                    </button>
                    <h2 style={{ marginBottom: 0 }}>Details</h2>
                </div>
                <div className="brand-logo" style={{ fontSize: '1.5rem' }}>
                    <span className="brand-text-aman">Amana</span>
                    <span className="brand-text-remit">Remit</span>
                </div>
            </div>

            {/* Summary Header */}
            <div style={{ background: 'var(--color-primary)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>
                    Sending <span className="font-bold">{total} MYR</span>.
                    <br />
                    Receiver gets <span className="font-bold">{usdAmount} USD</span>.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="text-sm font-bold mb-1" style={{ display: 'block' }}>Sender Full Name</label>
                    <input
                        type="text"
                        name="senderName"
                        value={formData.senderName}
                        onChange={handleChange}
                        placeholder="e.g. Ali Bin Abu"
                        required
                        style={{
                            width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)'
                        }}
                    />
                </div>

                <div className="mb-2">
                    <label className="text-sm font-bold mb-1" style={{ display: 'block' }}>Sender Contact / Phone</label>
                    <input
                        type="text"
                        name="senderContact"
                        value={formData.senderContact}
                        onChange={handleChange}
                        placeholder="+60..."
                        style={{
                            width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)'
                        }}
                    />
                </div>

                {/* Pay Method Selection */}
                <div className="mb-2">
                    <label className="text-sm font-bold mb-1" style={{ display: 'block' }}>Pay Method (Sender)</label>
                    <select
                        name="payMethod"
                        value={formData.payMethod}
                        onChange={handleChange}
                        style={{
                            width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)',
                            background: 'white'
                        }}
                    >
                        <option value="Mobile Wallet">Mobile Wallet</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash Deposit">Cash Deposit</option>
                    </select>
                </div>

                <div className="mb-2">
                    <label className="text-sm font-bold mb-1" style={{ display: 'block' }}>Receiver Full Name</label>
                    <input
                        type="text"
                        name="receiverName"
                        value={formData.receiverName}
                        onChange={handleChange}
                        placeholder="e.g. Abdi Hassan"
                        required
                        style={{
                            width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)'
                        }}
                    />
                </div>

                <div className="mb-2">
                    <label className="text-sm font-bold mb-1" style={{ display: 'block' }}>Receiver Account Details</label>
                    <textarea
                        name="receiverAccount"
                        value={formData.receiverAccount}
                        onChange={handleChange}
                        placeholder="Bank Name, Account Number, etc."
                        required
                        rows="3"
                        style={{
                            width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)', fontFamily: 'inherit'
                        }}
                    />
                </div>

                <button type="submit" className="btn-primary mt-2">
                    CONFIRM & PAY <CheckCircle size={20} />
                </button>
            </form>
        </div>
    );
}
