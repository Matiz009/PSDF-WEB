const express = require('express');
const connectDB = require('./connect_db');
const app = express();
const PORT = 3000;
// Middleware: parse JSON bodies
app.use(express.json());
const posts = require('./posts.json');

// A simple route
app.get('/', (req, res) => {
  res.json({ message: 'Hello Express!' });
});

//get all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});


//connect to the database and start the server
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on :${PORT}`);
});
