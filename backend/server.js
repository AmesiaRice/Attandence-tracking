const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhbvdK8LrHwEQEGpeOkf1PCJnLlZHgPxobywKV6Nb6gv_h_CND6N9yDzwurONqyqUAQw/exec';

app.post('/attendance', async (req, res) => {
  try {
    console.log('Forwarding data to Apps Script:', req.body); // Log the data being sent
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from Apps Script:', errorText); // Log the error from Apps Script
      return res.status(response.status).send(`Apps Script Error: ${errorText}`);
    }

    const result = await response.text();
    console.log('Response from Apps Script:', result); // Log the response from Apps Script
    res.status(200).send(result);
  } catch (error) {
    console.error('Error forwarding to Apps Script:', error.message); // Log the error message
    console.error('Stack Trace:', error.stack); // Log the stack trace for debugging
    res.status(500).send('Error recording attendance');
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
