// This is an endpoint used to sign an attached MoonPay widget URL when called

import express from 'express';  // Import the express framework for building the web server
import cors from 'cors';        // Import the cors middleware to enable Cross-Origin Resource Sharing
import crypto from 'crypto';    // Import the crypto module for cryptographic functions

const app = express();          // Create an express application instance
app.use(cors());                // Use the cors middleware to allow requests from different origins

const secretKey = process.env.MOONPAY_SECRET_KEY;

const generateSignature = (url) => {
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(new URL(url).search)
    .digest('base64');

  return signature;  // Just return the signature, no need for additional processing
};

// Define an endpoint to generate the signature
app.get('/sign-url', (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const signature = generateSignature(url);
    res.send(signature);  // Send just the signature
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;  // Use the port from environment variables or default to 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app as signUrlRouter }; // Export the app as a named export
