const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;

// Set up CORS for handling requests from the frontend
app.use(require('cors')());

// API endpoint to fetch top 100 cryptocurrencies and supported currencies
app.get('/api/currencies', async (req, res) => {
    try {
        // Use Coingecko API for demonstration purposes
        const response = await axios.get('https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': '3e6d3374-262e-4cca-9e14-49510e254b18',
              },
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 100,
                page: 1,
                sparkline: false,
            },
        });
        const currencies = response.data.map((crypto) => crypto.symbol.toUpperCase());
        currencies.push('USD', 'EUR'); // Add more currencies if needed
        res.json(currencies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint for currency conversion
app.get('/api/convert', async (req, res) => {
    const { sourceCrypto, amount, targetCurrency } = req.query;
    try {
        // Use Coingecko API for demonstration purposes
        const response = await axios.get('https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': '3e6d3374-262e-4cca-9e14-49510e254b18',
              },
            params: {
                ids: sourceCrypto,
                vs_currencies: targetCurrency,
            },
        });

        const exchangeRate = response.data[sourceCrypto][targetCurrency];
        const convertedAmount = amount * exchangeRate;
        res.json({ convertedAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



