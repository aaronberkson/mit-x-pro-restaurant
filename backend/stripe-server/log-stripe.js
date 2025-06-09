const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { message } = req.body;
    const logFilePath = path.join(process.cwd(), 'track-stripe-log.txt');
    
    // Add a prefix to the message for clarity
    const prefixedMessage = `[API - log-stripe.js] ${message}`;
    
    // Append the message to the log file
    fs.appendFile(logFilePath, `${new Date().toISOString()} - ${prefixedMessage}\n`, (err) => {
      if (err) {
        console.error("Failed to write to log file:", err);
        res.status(500).json({ error: "Failed to write to log file" });
      } else {
        res.status(200).json({ message: "Log entry added" });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
