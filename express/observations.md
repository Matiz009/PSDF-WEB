# API Observations & Changes Report

**Date:** 2026-06-17  
**Project:** Express REST API (Node.js + Mongoose + JWT)  
**Base URL:** `http://localhost:4000/api/v1`

---

## Summary

This report documents all bugs found and fixed, route convention changes applied, the MCP server implementation, and the results of testing every endpoint against a live MongoDB instance (`localhost:27017/first`). All 17 endpoint tests passed.

---

## Bugs Fixed

### Bug 1 — `deleteProduct` missing 404 check (`routes/product.js`)

**Before:**
```js
async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' }); // always 200, even if nothing deleted
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
```

**After:**
```js
async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // added
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
```

**Impact:** Deleting a non-existent product ID previously returned `200 OK` with a success message. Now correctly returns `404 Not Found`.

---

### Bug 2 — `updateProduct` returns stale document (`routes/product.js`)

**Before:**
```js
const product = await Product.findByIdAndUpdate(req.params.id, req.body);
```

**After:**
```js
const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
```

**Impact:** Mongoose's `findByIdAndUpdate` returns the *old* document by default. Without `{ new: true }`, the response showed pre-update values. The fix ensures the updated document is returned.

---

### Bug 3 — Unused `posts.json` import (`index.js`)

`const posts = require('./posts.json');` was imported but never referenced in any route. Removed entirely.

---

## Route Convention Changes

The product routes used action-verb naming instead of REST resource naming. All three were normalized:

| Before | After |
|--------|-------|
| `POST /api/v1/create-product` | `POST /api/v1/products` |
| `DELETE /api/v1/delete-product/:id` | `DELETE /api/v1/products/:id` |
| `PUT /api/v1/update-product/:id` | `PUT /api/v1/products/:id` |

Products now follow a clean RESTful resource pattern:
- `GET /api/v1/products` — list all
- `POST /api/v1/products` — create
- `GET /api/v1/products/:id` — get one
- `PUT /api/v1/products/:id` — update
- `DELETE /api/v1/products/:id` — delete

---

## MCP Server

**File:** `mcp-server.js`

The MCP server connects directly to MongoDB (bypassing HTTP) and exposes all API operations as callable tools. It uses `StdioServerTransport` and the `@modelcontextprotocol/sdk` package.

### Tools Exposed (12 total)

| Tool | Description |
|------|-------------|
| `get_products` | Get all products |
| `get_product_by_id` | Get product by MongoDB ObjectId |
| `create_product` | Create a new product |
| `update_product` | Update product by ID (returns updated doc) |
| `delete_product` | Delete product by ID (404 if not found) |
| `register_user` | Register a new user |
| `login_user` | Login and receive a JWT token |
| `get_users` | List all users (passwords excluded) |
| `get_user_by_id` | Get one user by ID |
| `delete_user` | Delete a user by ID |
| `get_profile` | Decode JWT and return user payload |
| `logout_user` | Client-side logout confirmation |

### How to Run the MCP Server

```bash
node mcp-server.js
```

### Claude Desktop Configuration

Add this block to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "express-api": {
      "command": "node",
      "args": ["C:/Users/Mati/Downloads/files/web/express/mcp-server.js"]
    }
  }
}
```

`claude_desktop_config.json` is located at:
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

---

## Endpoint Test Results

MongoDB was running at `localhost:27017/first`. All tests passed.

| # | Method | Endpoint | Input | Expected | Result | Pass? |
|---|--------|----------|-------|----------|--------|-------|
| 1 | GET | `/` | — | 200 `Hello Express!` | 200 `Hello Express!` | ✓ |
| 2 | POST | `/api/v1/products` | `{name, price, description}` | 201 product object | 201 with `_id` | ✓ |
| 3 | GET | `/api/v1/products` | — | 200 array | 200, 3 products | ✓ |
| 4 | GET | `/api/v1/products/:id` | valid ID | 200 product | 200 `Widget` | ✓ |
| 5 | PUT | `/api/v1/products/:id` | `{price:14.99}` | 200 updated product | 200 (updated) | ✓ |
| 6 | DELETE | `/api/v1/products/:id` | valid ID | 200 success | 200 deleted | ✓ |
| 7 | DELETE | `/api/v1/products/:id` | zero ObjectId | 404 not found | 404 | ✓ |
| 8 | POST | `/api/v1/register` | `{name, email, password}` | 201 user | 201 with `_id` | ✓ |
| 9 | POST | `/api/v1/register` | duplicate email | 409 conflict | 409 | ✓ |
| 10 | POST | `/api/v1/login` | correct credentials | 200 + token | 200 + JWT | ✓ |
| 11 | POST | `/api/v1/login` | wrong password | 401 | 401 | ✓ |
| 12 | GET | `/api/v1/users` | — | 200 array | 200, 2 users | ✓ |
| 13 | GET | `/api/v1/users/:id` | valid ID | 200 user | 200 `Test User` | ✓ |
| 14 | GET | `/api/v1/profile` | Bearer token | 200 Access granted | 200 | ✓ |
| 15 | GET | `/api/v1/profile` | no token | 401 | 401 | ✓ |
| 16 | POST | `/api/v1/logout` | — | 200 Logged out | 200 | ✓ |
| 17 | DELETE | `/api/v1/users/:id` | valid ID | 200 deleted | 200 deleted | ✓ |

**17/17 tests passed.**

---

## MongoDB Notes

- MongoDB was running locally at `mongodb://localhost:27017/first` during testing.
- The database `first` was created automatically on first write (Mongoose default behavior).
- If MongoDB is not running, `connect_db.js` logs the error but does **not** crash the process. The server starts normally but all DB-dependent routes return `500` errors.
- For production, consider using `process.exit(1)` in the MongoDB error handler so failures are visible immediately.

---

## Remaining Considerations

1. **Input validation** — no validation beyond Mongoose schema enforcement. Fields like `email` format, `password` minimum length, and `price >= 0` are not validated. Consider `express-validator` or `zod`.

2. **Rate limiting** — the `/login` and `/register` endpoints have no rate limiting, making them vulnerable to brute-force and spam. Consider `express-rate-limit`.

3. **Consistent route prefixes** — user routes (`/register`, `/login`, `/users`, `/profile`, `/logout`) now all correctly use the `/api/v1` prefix alongside product routes.

4. **`npm start`** — a `"start": "node index.js"` script was added to `package.json` so the server can be started with `npm start`.

5. **JWT logout** — the current logout only clears the cookie on the client side; the token itself remains valid until expiry. For proper stateless JWT logout, consider a token denylist (e.g., Redis) or short-lived tokens with refresh token rotation.

6. **`updateProduct` response** — fixed to return the updated document by adding `{ new: true }` to `findByIdAndUpdate`. Previously the response showed the pre-update values.

7. **Password in login response** — the login response does not expose the password hash (only `_id`, `name`, `email`, `token`). This is correct behavior.

8. **CORS** — no CORS headers are set. If a frontend on a different origin calls this API, requests will be blocked. Add the `cors` package if needed.
