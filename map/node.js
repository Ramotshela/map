// Node.js example using the 'express' package

const express = require('express');
const request = require('request'); // npm package for making HTTP requests

const app = express();

app.get('/proxy', (req, res) => {
  const url = req.query.url=AIzaSyAl7Ynr-zumzCMrGwfYsThv8jKWJNQ2RQ4; // URL to the API you want to proxy
  request(url).pipe(res);
});

app.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});
