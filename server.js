const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const routes = require('./routes/index'); // Load routes

// Mount routes on the app
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
