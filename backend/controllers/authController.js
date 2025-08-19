const { check, body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { use } = require('react');

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    title: "Airbnb - Login",
    currentPage: "login",
    isLoggedIn: false,
    oldInput: {
      email: "",  
      password: ""
    },
    errorMessage: [],
    userType: {},
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    title: "Airbnb - Sign Up",
    currentPage: "signup",
    isLoggedIn: false,
    // Don't pass errorMessage at all for initial load
    oldInput: {
      firstName: "",
      lastname: "",
      email: "",
      userType: "guest",
      terms: false,
    },
    errorMessage: [],
    userType: {},
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);
  console.log("Password provided:", password);
  
  const user = await User.findOne({ email });
  console.log("User found:", user ? "Yes" : "No");
  
  if(!user) {
    console.log("User not found in database");
    return res.status(401).render("auth/login", { 
      title: "Airbnb - Login",
      currentPage: "login",
      isLoggedIn: false,
      errorMessage: ["User does not exist"],
      oldInput: {
        email,
        password: "",
      },  
      userType: {},
    }); 
  }

  console.log("User found:", user.email);
  console.log("Stored password:", user.password.substring(0, 7) + "...");
  
  // Check if the stored password is actually a hash (should start with $2a$ or $2b$)
  let isMatch = false;
  
  if (user.password.startsWith("$2")) {
    // If it's a proper hash, use bcrypt to compare
    isMatch = await bcrypt.compare(password, user.password);
    console.log("Used bcrypt compare, result:", isMatch);
  } else {
    // If it's stored as plaintext (incorrect), do a direct comparison
    // THIS IS TEMPORARY FOR MIGRATION - SHOULD BE FIXED PROPERLY
    isMatch = password === user.password;
    console.log("Used direct compare (INSECURE!), result:", isMatch);
    
    // If it matched, update to a proper hash for next time
    if (isMatch) {
      console.log("Converting plaintext password to proper hash...");
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.updateOne({ _id: user._id }, { password: hashedPassword });
      console.log("Password properly hashed for future logins");
    }
  }
  
  console.log("Final password match result:", isMatch);
  
  if(!isMatch) {
    console.log("Password does not match");
    return res.status(422).render('auth/login',{
      title: 'Airbnb - Login',
      currentPage: 'login',
      isLoggedIn: false,
      errorMessage: ["Invalid password"],
      oldInput: {
        email,
        password: "",
      },
      userType: {},
    });
  }

  console.log("Password matched, setting session");
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  console.log("Session saved, redirecting to home");
  res.redirect("/");
};

exports.postLogout =  (req, res, next) => {
  // res.clearCookie("isLoggedIn");
  // res.cookie("isLoggedIn", false);
  // req.session.isLoggedIn = false;
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.redirect("/login");
  });
};

// API: Login
exports.postLoginApi = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User does not exist' });
    }
    let isMatch = false;
    if (user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.updateOne({ _id: user._id }, { password: hashedPassword });
      }
    }
    if (!isMatch) {
      return res.status(422).json({ message: 'Invalid password' });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    return res.json({ message: 'Logged in', user });
  } catch (err) {
    console.error('postLoginApi error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// API: Logout
exports.postLogoutApi = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logged out' });
  });
};

// API: Signup
exports.postSignupApi = async (req, res) => {
  const { firstName, lastname, email, userType, terms } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(e => e.msg) });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      firstName,
      lastname,
      email,
      password: hashedPassword,
      userType,
      terms: terms === true || terms === 'on'
    });
    await user.save();
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    return res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error('postSignupApi error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Validation middleware for signup
exports.validateSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long")
    // .isAlpha()
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("First name must contain only letters"),

  check("lastname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last name must contain only letters"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain at least one number")
    .matches(/[!@&*_]/)
    .withMessage("Password should contain at least one special character"),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type (host or guest)")
    .isIn(["host", "guest"])
    .withMessage("Please select a valid user type (host or guest)"),

  check("terms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions")
    .custom((value, { req }) => {
      if (!value) {
        throw new Error("You must accept the terms and conditions");
      }
      return true;
    })
];

// Process signup form submission
exports.postSignup = (req, res, next) => {
  const { firstName, lastname, email, userType, terms } = req.body;
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      title: "Airbnb - Sign Up",
      currentPage: "signup",
      isLoggedIn: false,
      errorMessage: errors.array().map((err) => err.msg),
      oldInput: {
        firstName,
        lastname,
        email,
        userType,
        terms,
      },
      userType: {},
    });
  }

  // First check if email already exists
  User.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(422).render("auth/signup", {
          title: "Airbnb - Sign Up",
          currentPage: "signup",
          isLoggedIn: false,
          errorMessage: ["Email already exists"],
          oldInput: {
            firstName,
            lastname,
            email,
            userType,
            terms,
          },
          userType: {},
        });
      }
      
      console.log("Creating new user with password length:", req.body.password.length);
      
      // Hash the password properly
      return bcrypt.hash(req.body.password, 12)
        .then((hashedPassword) => { 
          console.log("Generated hash length:", hashedPassword.length);
          console.log("Hash preview:", hashedPassword.substring(0, 10) + "...");
          
          const user = new User({
            firstName,
            lastname,
            email,
            password: hashedPassword,  // Store the hashed password, not plaintext
            userType,
            terms: terms === "on" ? true : false,
          });
          
          return user.save();
        })
    .then((result) => {
      req.session.isLoggedIn = true; // Set session variable after signup
      res.redirect("/login");
    })
    .catch(err => {
      console.error("Error in signup process:", err);
      res.status(500).render("auth/signup", {
        title: "Airbnb - Sign Up",
        currentPage: "signup",
        isLoggedIn: false,
        errorMessage: [err.message || "An error occurred while signing up"],
        oldInput: {
          firstName,
          lastname,
          email,
          userType,
          terms,
        },
        userType: {},
      });
    });
});
}