const express = require('express');
const { ui } = require('./utils');

const app = express();
const port = 8080;

app.use(express.static(__dirname + '/../client/public'));
app.get('/', ui());

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});