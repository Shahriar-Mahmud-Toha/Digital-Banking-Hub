import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

export default function ExchangeRate() {
    const [currency, setCurrency] = useState<string>('');
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;

    useEffect(() => {
        // Fetch exchange rate when currency code changes
        const timer = setTimeout(() => {
            if (currency.trim() !== '') {
                fetchExchangeRate(currency);
            }
        }, 1000); // Adjust the delay as needed

        return () => clearTimeout(timer);
    }, [currency]); // Run effect whenever currency changes

    const fetchExchangeRate = async (currencyCode: string) => {
        try {
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currencyCode}`);
            const rate = response.data.conversion_rates.BDT;
            setExchangeRate(rate);
        } catch (error) {
            console.error('Error fetching the exchange rate:', error);
            toast.error('Invalid Country Currency Code.');
            setExchangeRate(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (currency.trim() !== '') {
            await fetchExchangeRate(currency);
        } else {
            setExchangeRate(null);
            toast.error('Please enter a currency code.');
        }
    };

    return (
        <>
            <div className="card w-96 bg-base-200 shadow-xl">
                <Toaster />
                <div className="card-body">
                    <h1>Live Exchange Rate to BDT</h1>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Enter Currency Code:
                            <input
                                type="text"
                                placeholder="e.g., USD"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                                className="input input-bordered input-secondary w-full max-w-xs"
                            />
                        </label>
                        <br /><br />
                        <button className="btn glass" type="submit">Get Exchange Rate</button>
                    </form>
                    {currency.trim() !== '' && exchangeRate !== null && (
                        <div>
                            <h2>Exchange Rate for {currency} to BDT</h2>
                            <p>1 {currency} = {exchangeRate} BDT</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
