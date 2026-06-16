# JWT (JSON Web Token) — Implementation Steps

## What is JWT?

A JWT is a compact, self-contained token that carries a signed JSON payload. The server signs it with a secret key (`JWT_SECRET`). Anyone who has the token can read the payload, but only the server can verify it hasn't been tampered with.

**Structure:** `header.payload.signature`

---

## Packages Used

| Package | Purpose |
|---|---|
| `jsonwebtoken` | Sign and verify JWTs |
| `cookie-parser` | Parse cookies from incoming requests |
| `dotenv` | Load `JWT_SECRET` from `.env` |

```bash
npm install jsonwebtoken cookie-parser
```

---

## Step 1 — Store the secret in `.env`

```env
JWT_SECRET=mysecretkey@mati
```

Never hard-code this value. The `.env` file must be in `.gitignore`.

---

## Step 2 — Load middleware in `index.js`

```js
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const protect = require('./middleware/auth');
require('dotenv').config();

app.use(express.json());
app.use(cookieParser());   // must come before any route reads req.cookies
```

---

## Step 3 — Issue a token on login (`/login` route)

```js
const token = jwt.sign(
  { _id: user._id, name: user.name, email: user.email },  // payload
  process.env.JWT_SECRET,                                   // secret
  { expiresIn: '7d' }                                       // options
);
```

### Store in HTTP-only cookie

```js
res.cookie('token', token, {
  httpOnly: true,                                  // JS cannot access it — XSS safe
  secure: process.env.NODE_ENV === 'production',   // HTTPS only in prod
  sameSite: 'strict',                              // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000                 // 7 days in ms
});
```

### Also return in JSON body (for localStorage)

```js
res.json({ _id: user._id, name: user.name, email: user.email, token });
```

On the client side, save `token` from the response:

```js
// Client-side JavaScript
const res = await fetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
const data = await res.json();
localStorage.setItem('token', data.token);   // stored for future requests
```

---

## Step 4 — Auth middleware (`middleware/auth.js`)

```js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  let token;

  // Check Authorization header first: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Fall back to cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // { _id, name, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = protect;
```

The middleware checks two sources in order:

1. **Authorization header** — used when the client stores the token in `localStorage` and sends it manually:
   ```
   Authorization: Bearer <token>
   ```
2. **Cookie** — automatically sent by the browser on every request when using `httpOnly` cookies.

---

## Step 5 — Protect a route

```js
app.get('/profile', protect, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});
```

`protect` runs before the handler. If the token is missing or invalid, it returns 401 and the handler never runs.

---

## Step 6 — Logout

```js
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});
```

On the client side, also remove the localStorage entry:

```js
localStorage.removeItem('token');
```

---

## How to send the token from a client

### Option A — Cookie (automatic, browser does this for you)

The browser attaches the `token` cookie to every same-origin request automatically.

### Option B — Authorization header (localStorage)

```js
const token = localStorage.getItem('token');

fetch('/profile', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

## Token Flow Summary

```
Client                          Server
  |                               |
  |-- POST /login  ------------> |
  |                              |-- find user, verify password
  |                              |-- jwt.sign(payload, JWT_SECRET, { expiresIn })
  |                              |-- Set-Cookie: token=...  (httpOnly)
  |<-- { token, user info } ---- |
  |                               |
  |  localStorage.setItem('token', data.token)
  |                               |
  |-- GET /profile               |
  |   Authorization: Bearer ...  |
  |   (or cookie sent auto)   -> |-- jwt.verify(token, JWT_SECRET)
  |                              |-- attach decoded to req.user
  |<-- { user: { ... } } ------- |
```

---

## Security Notes

| Concern | How it's handled |
|---|---|
| XSS stealing cookie | `httpOnly: true` — JS cannot read it |
| CSRF attacks | `sameSite: 'strict'` — cookie not sent cross-site |
| Token forgery | `jwt.verify()` rejects any tampered token |
| Secret exposure | Stored in `.env`, never in code |
| Token expiry | `expiresIn: '7d'` — stale tokens rejected automatically |
