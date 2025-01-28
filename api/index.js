// api/index.js
import 'dotenv/config'; // Load environment variables using ES module syntax
import express from 'express'; // Import Express
import cors from 'cors'; // Import CORS middleware
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { signUrlRouter } from './signUrl.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Create an Express application

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON requests

// Serve the HTML with environment variables
app.get('/', async (req, res) => {
  try {
    let html = await fs.readFile(path.join(__dirname, '../src/public/index.html'), 'utf8');
    res.send(html);
  } catch (error) {
    console.error('Error reading index.html:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Use the signUrl router for API requests
app.use('/api', signUrlRouter);

// Start the server on the specified port
const PORT = process.env.PORT || 5001; // Use the port from environment variables or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log the server start
});

export default app; // Export the app for Vercel to use