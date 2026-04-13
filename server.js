const express = require('express');
const cors = require('cors');
const path = require('path');
const { getChecks, addCheck } = require('./storage');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/check', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const start = Date.now();
    try {
        const response = await fetch(url);
        const latency = Date.now() - start;
        
        const checkResult = {
            url,
            status: response.status,
            ok: response.ok,
            latency,
            timestamp: new Date().toISOString()
        };
        
        addCheck(checkResult);
        res.json(checkResult);
    } catch (error) {
        const latency = Date.now() - start;
        const checkResult = {
            url,
            status: 'Error',
            ok: false,
            latency,
            error: error.message,
            timestamp: new Date().toISOString()
        };
        
        addCheck(checkResult);
        res.status(500).json(checkResult);
    }
});

app.get('/api/history', (req, res) => {
    res.json(getChecks());
});

app.listen(PORT, () => {
    console.log(`API Sentinel listening on port ${PORT}`);
});
