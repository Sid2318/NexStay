# Environment Variables Guide

This document explains how to use the environment variables in the NexStay project.

## What are Environment Variables?

Environment variables are a way to store configuration values outside of your code. This is important for:

- Security (keeping secrets like API keys and passwords out of your codebase)
- Configuration management (easily switch between development, staging, and production environments)
- Flexibility (update values without changing code)

## Using the `.env` File

The `.env` file in the root of the project contains key-value pairs that represent configuration settings and secrets.

### How to Access Environment Variables

#### In Node.js/Express Backend

We use the `dotenv` package to load environment variables from the `.env` file. Make sure you have this package installed:

```bash
npm install dotenv
```

Then at the very top of your server entry file (e.g., `server.js` or `app.js`):

```javascript
require("dotenv").config();

// Now you can access env variables
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;
```

#### Examples of Using Environment Variables

**MongoDB Connection:**

```javascript
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
```

**Session Configuration:**

```javascript
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
```

**API Configuration:**

```javascript
app.use(`${process.env.API_PREFIX || "/api"}`, apiRoutes);
```

## Environment Variables in Frontend React

For the frontend, environment variables are a bit different. Create React App uses a special system for environment variables.

Create a `.env` file in your frontend directory:

```
VITE_API_URL=http://localhost:3000/api
```

Then in your React code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = apiUrl;
```

## Important Notes

1. **Never commit the `.env` file to version control.** It's already in `.gitignore`.
2. Keep a `.env.example` file in version control with dummy values as a template.
3. Always provide default values when accessing environment variables.

Example:

```javascript
const port = process.env.PORT || 3000;
```

4. In production, set environment variables through your hosting platform (Heroku, Vercel, AWS, etc.) rather than using a `.env` file.

## Available Environment Variables

| Variable       | Description                           | Default Value                                 |
| -------------- | ------------------------------------- | --------------------------------------------- |
| PORT           | Server port number                    | 3000                                          |
| NODE_ENV       | Environment (development, production) | development                                   |
| MONGODB_URI    | MongoDB connection string             | mongodb://localhost:27017/nexstay             |
| SESSION_SECRET | Secret for session management         | nexstay_super_secret_key_change_in_production |
| JWT_SECRET     | Secret for JWT token generation       | jwt_secret_key_for_token_generation           |
| UPLOAD_DIR     | Directory for file uploads            | uploads                                       |
| API_PREFIX     | Prefix for API routes                 | /api                                          |
| FRONTEND_URL   | URL of the frontend application       | http://localhost:5173                         |

## Security Best Practices

1. Use strong, unique secrets for production
2. Rotate secrets periodically
3. Limit access to your production environment variables
4. Never log environment variables
5. Validate and sanitize all inputs, even from environment variables
