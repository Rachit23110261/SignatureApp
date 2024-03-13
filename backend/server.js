// server.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:\Users\rachi\Desktop\rachit1st\SERS___\Signature\signature');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.jpg`);
  }
});

const upload = multer({ storage });

// Endpoint to handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  const imagePath = req.file.path;
  // Process the image (e.g., save to database, resize, etc.)
  // For demonstration purposes, we'll just log the path to the uploaded image
  console.log('Image uploaded:', imagePath);
  res.status(200).send('Image uploaded successfully');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
