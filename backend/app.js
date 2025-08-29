//Core Modules
const path = require("path");
const rootDir = require("./utils/pathUtil");
// const fs = require('fs');

//External Modules
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
// dotenv was added in the last change; revert if not needed
try {
  require("dotenv").config();
} catch (e) {}
const DB_PATH =
  process.env.MONGODB_URI ||
  "mongodb+srv://root:root@airbnb.uacxdsl.mongodb.net/Airbnb?retryWrites=true&w=majority&appName=Airbnb";

const app = express();

//Local Modules
const storeRouter = require("./routes/storeRouter");
const { hostRouter } = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");

// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadsDir = path.join(rootDir, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created at:", uploadsDir);
}

// Create uploads directory if it doesn't exist
// const uploadsDir = path.join(rootDir, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log('Uploads directory created at:', uploadsDir);
// }
const homesController = require("./controllers/errors");
const apiAuthRouter = require("./routes/apiAuthRouter");
const apiStoreRouter = require("./routes/apiStoreRouter");
const apiHostRouter = require("./routes/apiHostRouter");
const chatbotRouter = require("./routes/chatbotRouter");

app.set("view engine", "ejs");
app.set("views", "views");

const randomString = (length) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, and GIF files are allowed."
      ),
      false
    );
  }
};

const multerOptions = {
  storage: multerStorage,
  fileFilter: fileFilter,
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS for React frontend
app.use(
  cors({
    origin: process.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(multer(multerOptions).single("houseImage"));

// Serve static files
app.use(express.static(path.join(rootDir, "public")));
// Serve uploaded files
app.use("/uploads", express.static(path.join(rootDir, "uploads")));
// Serve uploaded files
app.use(
  session({
    secret: process.env.SESSION_SECRET || "session_secret_key",
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({
      uri: DB_PATH,
      collection: "sessions",
    }),
  })
);

// Parse cookies BEFORE accessing them
app.use(cookieParser());

//these two lines are necessary to parse the body of POST requests
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

app.use((req, res, next) => {
  // Make sure session values are available
  req.session.isLoggedIn = req.session.isLoggedIn || false;

  // Set user data for all views
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.user = req.session.user || null;
  res.locals.currentPage = "";

  console.log("Session isLoggedIn:", req.session.isLoggedIn);
  console.log("Session user:", req.session.user ? "Present" : "Not present");
  next();
});

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
  // Redirect to login if not authenticated
});
app.use("/host", hostRouter);

// JSON API routes
app.use("/api", apiAuthRouter);
app.use("/api", apiStoreRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/host", (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
});
app.use("/api/host", apiHostRouter);

//Error handling middleware
app.use(homesController.error404);

const PORT = 3000;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
