# Implementation Steps: bcryptjs, User Model & dotenv

## 1. Install the packages

```bash
npm install bcryptjs dotenv
```

Both are already listed as dependencies in `package.json`, so this just pulls them into `node_modules` if not already there.

---

## 2. Implement bcryptjs in the User Model (`model/user.js`)

### Require bcryptjs at the top

```js
const bcrypt = require('bcryptjs');
```

### Hash the password before saving (pre-save hook)

Add this **after** defining the schema:

```js
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});
```

- `this.isModified('password')` — skips re-hashing if the password field wasn't changed (e.g. on profile updates).
- `bcrypt.hash(this.password, 10)` — hashes with a salt round of 10.

### Add a method to compare passwords on login

```js
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

### Full `model/user.js`

```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

## 3. Use bcryptjs in `index.js`

No direct bcrypt import is needed in `index.js` — all hashing and comparison is handled by the User model methods. The routes just call those methods:

### Register route — password hashed automatically by the pre-save hook

```js
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = new User({ name, email, password }); // plain password here
    await user.save();                                  // hook hashes it before saving
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

### Login route — compare password using the model method

```js
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password); // calls bcrypt.compare internally
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ _id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## 4. Implement dotenv

### Create a `.env` file in the project root

```
MONGO_URI=mongodb://localhost:27017/first
JWT_SECRET=MY_SUPER_SECRET_KEY
PORT=4000
```

> Never commit `.env` to git. Make sure `.gitignore` includes `.env`.

### Load dotenv in `connect_db.js`

Call `require('dotenv').config()` at the top, before using any `process.env` variable:

```js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectDB;
```

### Use the env variable for PORT in `index.js`

Replace the hardcoded port number with the env variable:

```js
const PORT = process.env.PORT || 4000;
```

For `dotenv` to be available in `index.js` as well, either:
- Call `require('dotenv').config()` at the very top of `index.js`, **before** any other requires, **or**
- Rely on `connect_db.js` loading it (only safe if `connectDB()` is called before `process.env.PORT` is read — not guaranteed)

The safest approach is to load it once at the top of `index.js`:

```js
require('dotenv').config();          // must be first
const express = require('express');
const connectDB = require('./connect_db');
const User = require('./model/user');
const Product = require('./model/product');

const app = express();
const PORT = process.env.PORT || 4000;
```

---

## Summary of what each file does

| File            | Role                                                      |
|-----------------|-----------------------------------------------------------|
| `.env`          | Stores secrets — never hardcode these in source files     |
| `connect_db.js` | Reads `MONGO_URI` from env, connects mongoose             |
| `model/user.js` | Defines schema, hashes password on save, exposes compare  |
| `index.js`      | Loads env, wires routes, calls `comparePassword` on login |
