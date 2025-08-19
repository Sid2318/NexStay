const Home = require("../models/home");
// const Favourite = require("../models/favourite");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  console.log("is logged in:", req.session);
  Home.find()
    .then((registerHome) => {
      res.render("store/index", {
        registerHome: registerHome,
        title: "Airbnb - Home",
        currentPage: "Index",
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || null,
      });
    })
    .catch((err) => {
      console.log("Error fetching homes for index:", err);
      res.status(500).send("Error loading homepage");
    });
};

exports.getHome = (req, res, next) => {
  console.log(req.body);
  Home.find()
    .then((registerHome) => {
      res.render("store/home-list", {
        registerHome: registerHome,
        title: "Airbnb - Home",
        currentPage: "Home",
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || null,
      });
    })
    .catch((err) => {
      console.log("Error fetching homes for home list:", err);
      res.status(500).send("Error loading homes page");
    });
};

// API: list homes
exports.apiGetHomes = async (req, res) => {
  try {
    const homes = await Home.find();
    res.json(homes);
  } catch (err) {
    console.error('apiGetHomes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookings = (req, res, next) => {
  console.log(req.body);
  Home.find()
    .then((registerHome) => {
      res.render("store/bookings", {
        registerHome: registerHome,
        title: "Airbnb - Bookings",
        currentPage: "bookings",
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || null,
      });
    })
    .catch((err) => {
      console.log("Error fetching homes for bookings:", err);
      res.status(500).send("Error loading bookings page");
    });
};

exports.getFavouritesList = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.redirect("/login");
    }

    const userId = req.session.user._id;
    console.log("Fetching favorites for user ID:", userId);

    // Find user and populate their favorites (homes they've saved)
    const user = await User.findById(userId).populate("favourites");

    if (!user) {
      console.log("User not found");
      return res.redirect("/");
    }

    console.log("User found:", user.email);
    console.log(
      "Favourite homes found:",
      user.favourites ? user.favourites.length : 0
    );

    res.render("store/favourite-list", {
      favouriteHomes: user.favourites || [],
      title: "Airbnb - Favourites",
      currentPage: "Favourites",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).render("error", {
      message: "Failed to load favorites",
      error: { status: 500, stack: err.stack },
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  }
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId; //by usiing req.params we can access the paramerters
  //homeId is the same name which we have passed in routers /homes/:homeId
  console.log(`Fetching details for home ID: ${homeId}`);
  console.log(
    `HomeId type: ${typeof homeId}, length: ${
      homeId ? homeId.length : "undefined"
    }`
  );

  // Validate homeId before proceeding
  if (!homeId) {
    console.log("No homeId provided");
    return res.redirect("/homes");
  }

  Home.findById(homeId)
    .then((homeDetails) => {
      if (homeDetails) {
        console.log("Home details found:", homeDetails.houseName);
        res.render("store/home-detail", {
          home: homeDetails,
          title: "Home Details",
          currentPage: "HomeDetails",
          isLoggedIn: req.session.isLoggedIn || false,
          user: req.session.user || null,
        });
      } else {
        console.log(`Home with ID ${homeId} not found.`);
        res.redirect("/homes"); // Redirect to homes list if home not found
      }
    })
    .catch((err) => {
      console.log("Error fetching home details:", err);
      res.redirect("/homes");
    });
};

// API: home details
exports.apiGetHomeDetails = async (req, res) => {
  try {
    const home = await Home.findById(req.params.homeId);
    if (!home) return res.status(404).json({ message: 'Home not found' });
    res.json(home);
  } catch (err) {
    console.error('apiGetHomeDetails error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.postAddToFavourites = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findOne({ _id: userId });

  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.postRemoveFromFavourites = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (!user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(
      (fav) => fav.toString() !== homeId
    );
    await user.save();
  }

  res.redirect("/favourites");
};

exports.addToFavourites = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn || !req.session.user) {
      return res.redirect("/login");
    }

    const homeId = req.body.homeId;
    const userId = req.session.user._id;

    console.log(`Adding home ${homeId} to favorites for user ${userId}`);

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found");
      return res.redirect("/");
    }

    // Check if the home is already in favorites
    if (user.favourites.includes(homeId)) {
      console.log("Home already in favorites");
      return res.redirect("/favourites");
    }

    // Add the home to favorites
    user.favourites.push(homeId);
    await user.save();

    console.log("Home added to favorites successfully");
    res.redirect("/favourites");
  } catch (err) {
    console.error("Error adding to favorites:", err);
    res.status(500).send("Error adding to favorites");
  }
};

exports.removeFromFavourites = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn || !req.session.user) {
      return res.redirect("/login");
    }

    const homeId = req.body.homeId;
    const userId = req.session.user._id;

    console.log(`Removing home ${homeId} from favorites for user ${userId}`);

    // Find the user and update to remove the home from favorites
    const result = await User.findByIdAndUpdate(
      userId,
      { $pull: { favourites: homeId } },
      { new: true }
    );

    console.log("Home removed from favorites successfully");
    res.redirect("/favourites");
  } catch (err) {
    console.error("Error removing from favorites:", err);
    res.status(500).send("Error removing from favorites");
  }
};

// API: favourites
exports.apiGetFavourites = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.session.user._id).populate('favourites');
    res.json(user?.favourites || []);
  } catch (err) {
    console.error('apiGetFavourites error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.apiAddToFavourites = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
    const { homeId } = req.body;
    const user = await User.findById(req.session.user._id);
    if (!user.favourites.includes(homeId)) {
      user.favourites.push(homeId);
      await user.save();
    }
    res.status(201).json({ message: 'Added' });
  } catch (err) {
    console.error('apiAddToFavourites error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.apiRemoveFromFavourites = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
    const { homeId } = req.params;
    const user = await User.findById(req.session.user._id);
    user.favourites = user.favourites.filter(f => f.toString() !== homeId);
    await user.save();
    res.json({ message: 'Removed' });
  } catch (err) {
    console.error('apiRemoveFromFavourites error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Booking functionality
exports.getBookingPage = async (req, res, next) => {
  console.log("getBookingPage called with homeId:", req.params.homeId);
  try {
    const homeId = req.params.homeId;
    const home = await Home.findById(homeId);

    console.log("Home found:", home ? "Yes" : "No");
    if (!home) {
      console.log("Home not found for ID:", homeId);
      return res.status(404).send("Home not found");
    }

    console.log("Rendering reserve page for home:", home.houseName);
    res.render("store/reserve", {
      home: home,
      title: "Book " + home.houseName,
      currentPage: "booking",
      isLoggedIn: req.session.isLoggedIn || false,
      user: req.session.user || null,
    });
  } catch (err) {
    console.error("Error loading booking page:", err);
    res.status(500).send("Error loading booking page");
  }
};

exports.postBooking = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const {
      checkIn,
      checkOut,
      guests,
      paymentMode,
      guestName,
      guestEmail,
      guestPhone,
    } = req.body;

    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).send("Home not found");
    }

    // Calculate total price (simple calculation - you can enhance this)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * home.price;

    // Here you would typically save the booking to a database
    // For now, we'll just redirect to a success page or bookings page
    console.log("Booking details:", {
      homeId,
      homeName: home.houseName,
      checkIn,
      checkOut,
      guests,
      nights,
      totalPrice,
      paymentMode,
      guestName,
      guestEmail,
      guestPhone,
    });

    // Redirect to bookings page with success message
    res.redirect("/bookings?success=true");
  } catch (err) {
    console.error("Error processing booking:", err);
    res.status(500).send("Error processing booking");
  }
};

// API: booking
exports.apiPostBooking = async (req, res) => {
  try {
    const homeId = req.params.homeId;
    const { checkIn, checkOut, guests, paymentMode, guestName, guestEmail, guestPhone } = req.body;
    const home = await Home.findById(homeId);
    if (!home) return res.status(404).json({ message: 'Home not found' });
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * home.price;
    // Persist booking if user is logged in
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const booking = new Booking({
      home: home._id,
      guest: req.session.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      paymentMode,
      totalPrice,
    });
    await booking.save();
    return res.status(201).json({ message: 'Booked', nights, totalPrice, bookingId: booking._id });
  } catch (err) {
    console.error('apiPostBooking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// API: get bookings for current user
// apiGetBookings was introduced temporarily; removing to revert to placeholder UI
