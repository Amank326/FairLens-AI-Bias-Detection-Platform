require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const analyzeRoutes = require('./routes/analyzeData');

const app = express();
// Ensure app uses process.env.PORT for Azure Linux App Service compatibility!
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend UI perfectly
app.use(express.static(__dirname));

// Use the API route (maps correctly to /analyze or /api/analyze if defined inside)
app.use('/api', analyzeRoutes); // /api/analyze

// Map raw /analyze for the user's explicit request just in case
app.use('/', analyzeRoutes); // /analyze

app.listen(port, () => {
  console.log(`FairLens backend listening at http://localhost:${port}`);
});
