// index.js
import 'dotenv/config'; // Load environment variables using ES module syntax
import express from 'express'; // Import Express
import cors from 'cors'; // Import CORS middleware
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { signUrlRouter } from '../src/routes/signUrl.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Create an Express application

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON requests

// Serve the HTML with environment variables
app.get('/', async (req, res) => {
  // Read the HTML file
  let html = await fs.readFile(path.join(__dirname, '../src/public/index.html'), 'utf8');
  
  // Replace placeholders with actual API keys
  html = html.replace('XAMAN_API_KEY_PLACEHOLDER', process.env.XAMAN_API_KEY);
  html = html.replace('MOONPAY_PUBLIC_KEY_PLACEHOLDER', process.env.MOONPAY_PUBLIC_KEY);
  
  res.send(html);
});

// Use the signUrl router for API requests
app.use('/api', signUrlRouter); 

// Start the server on the specified port
const PORT = process.env.PORT || 5001; // Use the port from environment variables or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log the server start
});