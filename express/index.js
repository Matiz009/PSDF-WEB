const express = require('express');
const connectDB = require('./connect_db');
const Product = require('./model/product');
const app = express();
const PORT = 4000;
// Middleware: parse JSON bodies
app.use(express.json());
const posts = require('./posts.json');

// A simple route
app.get('/', (req, res) => {
  res.json({ message: 'Hello Express!' });
});

//get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//create a new product

app.post('/create-product', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.delete('/delete-product/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.put('/update-product/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//connect to the database and start the server
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on :${PORT}`);
});
