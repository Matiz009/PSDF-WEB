const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const jwt = require('jsonwebtoken');
const connectDB = require('./connect_db');
const Product = require('./model/product');
const User = require('./model/user');
require('dotenv').config();

const server = new Server(
  { name: 'express-api', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // --- Product tools ---
    {
      name: 'get_products',
      description: 'Get all products from the database',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_product_by_id',
      description: 'Get a single product by its MongoDB ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', description: 'MongoDB ObjectId of the product' } },
        required: ['id'],
      },
    },
    {
      name: 'create_product',
      description: 'Create a new product',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          price: { type: 'number' },
          description: { type: 'string' },
        },
        required: ['name', 'price'],
      },
    },
    {
      name: 'update_product',
      description: 'Update an existing product by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'MongoDB ObjectId of the product' },
          name: { type: 'string' },
          price: { type: 'number' },
          description: { type: 'string' },
        },
        required: ['id'],
      },
    },
    {
      name: 'delete_product',
      description: 'Delete a product by ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', description: 'MongoDB ObjectId of the product' } },
        required: ['id'],
      },
    },
    // --- User tools ---
    {
      name: 'register_user',
      description: 'Register a new user account',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['name', 'email', 'password'],
      },
    },
    {
      name: 'login_user',
      description: 'Login with email and password. Returns a JWT token.',
      inputSchema: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
      },
    },
    {
      name: 'get_users',
      description: 'Get all users (passwords excluded)',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_user_by_id',
      description: 'Get a single user by MongoDB ID (password excluded)',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', description: 'MongoDB ObjectId of the user' } },
        required: ['id'],
      },
    },
    {
      name: 'delete_user',
      description: 'Delete a user by MongoDB ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', description: 'MongoDB ObjectId of the user' } },
        required: ['id'],
      },
    },
    {
      name: 'get_profile',
      description: 'Get the profile of the authenticated user. Requires a valid JWT token.',
      inputSchema: {
        type: 'object',
        properties: { token: { type: 'string', description: 'JWT token obtained from login_user' } },
        required: ['token'],
      },
    },
    {
      name: 'logout_user',
      description: 'Logout the current user (clears session context). Requires a valid JWT token.',
      inputSchema: {
        type: 'object',
        properties: { token: { type: 'string', description: 'JWT token to invalidate (client-side only)' } },
        required: ['token'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const ok = (data) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });
  const err = (msg) => ({ isError: true, content: [{ type: 'text', text: msg }] });

  try {
    switch (name) {
      // --- Products ---
      case 'get_products': {
        const products = await Product.find();
        return ok(products);
      }
      case 'get_product_by_id': {
        const product = await Product.findById(args.id);
        if (!product) return err('Product not found');
        return ok(product);
      }
      case 'create_product': {
        const product = new Product({ name: args.name, price: args.price, description: args.description });
        await product.save();
        return ok(product);
      }
      case 'update_product': {
        const { id, ...update } = args;
        const product = await Product.findByIdAndUpdate(id, update, { new: true });
        if (!product) return err('Product not found');
        return ok(product);
      }
      case 'delete_product': {
        const product = await Product.findByIdAndDelete(args.id);
        if (!product) return err('Product not found');
        return ok({ message: 'Product deleted successfully' });
      }

      // --- Users ---
      case 'register_user': {
        const existing = await User.findOne({ email: args.email });
        if (existing) return err('Email already in use');
        const user = new User({ name: args.name, email: args.email, password: args.password });
        await user.save();
        return ok({ _id: user._id, name: user.name, email: user.email });
      }
      case 'login_user': {
        const user = await User.findOne({ email: args.email });
        if (!user) return err('Invalid credentials');
        const match = await user.comparePassword(args.password);
        if (!match) return err('Invalid credentials');
        const token = jwt.sign(
          { _id: user._id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        return ok({ _id: user._id, name: user.name, email: user.email, token });
      }
      case 'get_users': {
        const users = await User.find().select('-password');
        return ok(users);
      }
      case 'get_user_by_id': {
        const user = await User.findById(args.id).select('-password');
        if (!user) return err('User not found');
        return ok(user);
      }
      case 'delete_user': {
        const user = await User.findByIdAndDelete(args.id);
        if (!user) return err('User not found');
        return ok({ message: 'User deleted successfully' });
      }
      case 'get_profile': {
        try {
          const decoded = jwt.verify(args.token, process.env.JWT_SECRET);
          return ok({ message: 'Access granted', user: decoded });
        } catch {
          return err('Not authorized, token invalid or expired');
        }
      }
      case 'logout_user': {
        return ok({ message: 'Logged out successfully' });
      }

      default:
        return err(`Unknown tool: ${name}`);
    }
  } catch (e) {
    return err(e.message);
  }
});

async function main() {
  await connectDB();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
