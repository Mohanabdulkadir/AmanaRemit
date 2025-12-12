import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Logo from '../assets/logo.png'; // Value from previous edit

export default function Calculator() {
    const navigate = useNavigate();
    const [exchangeRate, setExchangeRate] = useState(0.2245); // Default fallback
    const [loadingRate, setLoadingRate] = useState(true);

    const [sendAmount, setSendAmount] = useState(''); // MYR
    const [receiveAmount, setReceiveAmount] = useState(''); // USD

    const [fee, setFee] = useState('0.00'); // 1%
    const [total, setTotal] = useState('0.00');

    // Helper: Round UP to nearest 0.10
    // ceil(3.01 * 10) / 10 = ceil(30.1) / 10 = 31 / 10 = 3.10
    const ceilTo10 = (num) => {
        return (Math.ceil(num * 10) / 10).toFixed(2);
    };

    // Fetch Exchange Rate
    useEffect(() => {
        const fetchRate = async () => {
            try {
                // Using frankfurter API for MYR -> USD
                const res = await fetch('https://api.frankfurter.app/latest?from=MYR&to=USD');
                const data = await res.json();
                if (data && data.rates && data.rates.USD) {
                    // Apply 2.10% Hidden Margin (R' = R * 0.979)
                    const rawRate = data.rates.USD;
                    const clientRate = rawRate * 0.979;
                    setExchangeRate(clientRate);
                }
            } catch (error) {
                console.error("Failed to fetch rate, using default", error);
            } finally {
                setLoadingRate(false);
            }
        };
        fetchRate();
    }, []);

    // Handler: "You Send" (MYR) -> Calculate USD
    const handleSendChange = (e) => {
        const val = e.target.value;
        setSendAmount(val);

        if (!val || isNaN(val)) {
            setReceiveAmount('');
            setFee('0.00');
            setTotal('0.00');
            return;
        }

        const myr = parseFloat(val);

        // Calculate USD: Round UP to 0.10
        const usd = myr * exchangeRate;
        setReceiveAmount(ceilTo10(usd));

        // Fee (1%): Round UP to 0.10
        const rawFee = myr * 0.01;
        const roundedFee = ceilTo10(rawFee);
        setFee(roundedFee);

        // Total: Round UP to 0.10
        const totalDue = myr + parseFloat(roundedFee);
        setTotal(ceilTo10(totalDue));
    };

    // Handler: "They Receive" (USD) -> Calculate MYR
    const handleReceiveChange = (e) => {
        const val = e.target.value;
        setReceiveAmount(val);

        if (!val || isNaN(val)) {
            setSendAmount('');
            setFee('0.00');
            setTotal('0.00');
            return;
        }

        const usd = parseFloat(val);

        // Calculate MYR: Use CEIL logic to avoid underpayment, round up to 0.10
        const myr = usd / exchangeRate;
        const roundedMyr = ceilTo10(myr);

        setSendAmount(roundedMyr);

        // Fee based on derived MYR
        const rawFee = parseFloat(roundedMyr) * 0.01;
        const roundedFee = ceilTo10(rawFee);
        setFee(roundedFee);

        const totalDue = parseFloat(roundedMyr) + parseFloat(roundedFee);
        setTotal(ceilTo10(totalDue));
    };

    const handleNext = () => {
        if (!sendAmount || !receiveAmount) return;

        navigate('/details', {
            state: {
                myrAmount: parseFloat(sendAmount).toFixed(2),
                usdAmount: parseFloat(receiveAmount).toFixed(2),
                fee: fee,
                total: total,
                rate: exchangeRate
            }
        });
    };

    return (
        <div className="card">
            <div className="text-center mb-2">
                <div className="brand-logo" style={{ fontSize: '2.5rem' }}>
                    <span className="brand-text-aman">Amana</span>
                    <span className="brand-text-remit">Remit</span>
                </div>
            </div>

            {/* Exchange Rate Badge */}
            <div style={{
                background: '#e0f2f1',
                color: '#00695c',
                padding: '0.5rem',
                borderRadius: '20px',
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                display: 'inline-block',
                width: '100%'
            }}>
                <div>1.00 MYR = {exchangeRate.toFixed(4)} USD</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>
                    1.00 USD = {(1 / exchangeRate).toFixed(4)} MYR
                </div>
            </div>

            {/* Calculator Form */}
            <div className="input-group mb-2">
                <label className="text-sm font-bold mb-1" style={{ display: 'block' }}>You send</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type="number"
                        value={sendAmount}
                        onChange={handleSendChange}
                        placeholder="0.00"
                        step="0.10"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            paddingLeft: '3.5rem',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            outline: 'none'
                        }}
                    />
                    <img
                        src="https://flagcdn.com/w40/my.png"
                        alt="MYR"
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '24px',
                            height: 'auto',
                            borderRadius: '2px'
                        }}
                    />
                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }}>
                        MYR
                    </span>
                </div>
            </div>

            <div className="input-group mb-2">
                <label className="text-sm font-bold mb-1" style={{ display: 'block' }}>They receive</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type="number"
                        value={receiveAmount}
                        onChange={handleReceiveChange}
                        placeholder="0.00"
                        step="0.10"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            paddingLeft: '3.5rem',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            outline: 'none'
                        }}
                    />
                    <img
                        src="https://flagcdn.com/w40/so.png"
                        alt="USD"
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '24px',
                            height: 'auto',
                            borderRadius: '2px'
                        }}
                    />
                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }}>
                        USD
                    </span>
                </div>
            </div>

            {/* Summary */}
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="text-sm text-light">Transfer fee (1%)</span>
                    <span className="font-bold">{fee} MYR</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '0.5rem' }}>
                    <span className="font-bold">Total to Pay</span>
                    <span className="font-bold" style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>{total} MYR</span>
                </div>
            </div>

            <button className="btn-primary" onClick={handleNext} disabled={!sendAmount || parseFloat(sendAmount) <= 0}>
                NEXT <ArrowRight size={20} />
            </button>
        </div>
    );
}
