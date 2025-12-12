import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Printer, CheckCircle } from 'lucide-react';

export default function Invoice() {
    const location = useLocation();
    const navigate = useNavigate();
    // Data: myrAmount, usdAmount, fee, total, rate, senderName, senderContact, receiverName, receiverAccount, payMethod, transactionId, timestamp
    const data = location.state;

    useEffect(() => {
        if (!data) {
            navigate('/');
        }
    }, [data, navigate]);

    if (!data) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container" style={{ paddingTop: '0' }}>
            {/* Remove default container padding top for print if needed, but styling here overrides */}

            <div className="card mt-2">
                {/* Header */}
                <div className="text-center mb-2">
                    <div style={{ marginBottom: '1rem' }}>
                        <div className="brand-logo" style={{ fontSize: '2.8rem' }}>
                            <span className="brand-text-aman">Amana</span>
                            <span className="brand-text-remit">Remit</span>
                        </div>
                    </div>
                    <div style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                        <CheckCircle size={64} />
                    </div>
                    <h1 style={{ color: 'var(--color-primary)', fontSize: '1.8rem' }}>Transfer Successful! 🚀</h1>
                    <p className="text-sm text-light">
                        Your AmanaRemit transaction is complete.<br />
                        Reference: <span className="font-bold">{data.transactionId}</span>
                    </p>
                    <p className="text-xs text-light mt-1">{data.timestamp}</p>
                </div>

                <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px dashed #ddd' }} />

                {/* Financial Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <p className="text-sm text-light">You Paid</p>
                        <p className="font-bold" style={{ fontSize: '1.2rem' }}>{data.total} MYR</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-light">Receiver Got</p>
                        <p className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>{data.usdAmount} USD</p>
                    </div>
                </div>

                <div className="text-center mb-2">
                    <span style={{ background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                        Rate Used: 1 MYR = {data.rate.toFixed(4)} USD
                    </span>
                </div>

                {/* Breakdown */}
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <h3 className="text-sm font-bold mb-1" style={{ textTransform: 'uppercase', color: '#666' }}>Breakdown</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Amount Sent (Principal)</span>
                        <span>{data.myrAmount} MYR</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Transfer Fee (1%)</span>
                        <span>{data.fee} MYR</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                        <span className="font-bold">Total Amount Charged</span>
                        <span className="font-bold">{data.total} MYR</span>
                    </div>
                </div>

                {/* Details */}
                <div className="mb-2">
                    <h3 className="text-sm font-bold mb-1" style={{ textTransform: 'uppercase', color: '#666' }}>Details</h3>
                    <p className="text-sm"><span className="font-bold">Sender:</span> {data.senderName} {data.senderContact && `(${data.senderContact})`}</p>
                    <p className="text-sm mt-1"><span className="font-bold">Pay Method:</span> {data.payMethod || 'Mobile Wallet'}</p>
                    <p className="text-sm mt-1"><span className="font-bold">Receiver:</span> {data.receiverName}</p>
                    <p className="text-sm mt-1"><span className="font-bold">Account:</span> {data.receiverAccount}</p>
                </div>

                {/* Actions */}
                <button onClick={handlePrint} className="btn-primary no-print">
                    Download PDF Invoice <Printer size={20} />
                </button>

                <button onClick={() => navigate('/')} className="no-print" style={{
                    width: '100%',
                    padding: '1rem',
                    marginTop: '0.5rem',
                    background: 'none',
                    color: 'var(--color-text-light)',
                    fontWeight: '600'
                }}>
                    Make Another Transfer
                </button>

            </div>
        </div>
    );
}
