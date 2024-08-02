const express = require('express');
const { codeshow, app: appUI, FileExplorer } = require('./utils');

const app = express();
const port = 9090;

app.use(express.static(__dirname + '/../client/public'));
app.get('/api/files', FileExplorer.getFiles);
app.get('/api/file', FileExplorer.getFileContent);
app.post('/api/file', express.json(), FileExplorer.saveFileContent);
app.get('/app', appUI());
app.get('/', codeshow());

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});