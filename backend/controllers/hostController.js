const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    title: "Add Home",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    userType: req.session.user,
  });
};

exports.getHostHome = (req, res, next) => {
  console.log("Fetching all homes from database...");
  Home.find()
    .then((registeredHomes) => {
      console.log("Homes fetched successfully:", registeredHomes);
      console.log("Number of homes:", registeredHomes.length);
      res.render("host/host-home-list", {
        registeredHomes: registeredHomes,
        title: "Host Homes List",
        currentPage: "host-homes",
        isLoggedIn: req.session.isLoggedIn,
        userType: req.session.user,
      });
    })
    .catch((err) => {
      console.log("Error fetching homes:", err);
      res.redirect("/error");
    });
};

exports.postAddHome = (req, res, next) => {
  console.log("Home added:", req.body, req.body.houseName);
  const { houseName, price, houseLocation, rating, description } =
    req.body;
    console.log("House image file:", req.file);

    if (!req.file) {
      return res.status(422).render("host/edit-home", {
        title: "Add Home",
        currentPage: "addHome",
        editing: false,
        isLoggedIn: req.session.isLoggedIn,
        userType: req.session.user,
        errorMessage: "Please upload an image file (JPEG, PNG, or GIF).",
        oldInput: { houseName, price, houseLocation, rating, description }
      });
    }

  const houseImage = req.file.path.replace(/\\/g, '/'); // Convert backslashes to forward slashes for web URLs
  console.log("Image path being saved:", houseImage);

  const home = new Home({
    houseName,
    price,
    houseLocation,
    rating,
    houseImage,
    description,
  });


  home
    .save()
    .then(() => {
      console.log("Home saved successfully");
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error saving home:", err);
      res.redirect("/host/add-home");
    });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = true; // Always true when editing
  console.log(`Editing home with ID: ${homeId}`);

  Home.findById(homeId)
    .then((homeDetails) => {
      if (homeDetails) {
        // MongoDB findOne returns single document or null
        console.log("Home details found for editing:", homeDetails);
        res.render("host/edit-home", {
          home: homeDetails,
          title: "Edit Home",
          currentPage: "host-homes",
          editing: editing,
          isLoggedIn: req.session.isLoggedIn,
          userType: req.session.user,
        });
      } else {
        console.log(`Home with ID ${homeId} not found for editing.`);
        res.redirect("/host/host-home-list");
      }
    })
    .catch((err) => {
      console.log("Error fetching home for editing:", err);
      res.redirect("/host/host-home-list");
    });
};

exports.postEditHome = (req, res, next) => {
  const {
    id,
    houseName,
    price,
    houseLocation,
    rating,
    description,
  } = req.body;

  console.log("House image file:", req.file);

  Home.findById(id)
    .then((home) => {
      if (!home) {
        console.log(`Home with ID ${id} not found for editing.`);
        return res.redirect("/host/host-home-list");
      }

      // Update home properties
      home.houseName = houseName;
      home.price = price;
      home.houseLocation = houseLocation;
      home.rating = rating;
      home.description = description;
      
      if(req.file){
        home.houseImage = req.file.path.replace(/\\/g, '/'); // Convert backslashes to forward slashes
      }

      console.log("Editing home with data:", {
        id,
        houseName,
        price,
        houseLocation,
        rating,
        houseImage: home.houseImage,
        description,
      });

      return home.save();
    })
    .then(() => {
      console.log("Home updated successfully");
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error updating home:", err);
      res.redirect("/host/host-home-list");
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log(`Deleting home with ID: ${homeId}`);
  
  // Use findOneAndDelete to ensure the post middleware gets triggered
  Home.findOneAndDelete({ _id: homeId })
    .then((deletedHome) => {
      if (deletedHome) {
        console.log(`Home with ID ${homeId} deleted successfully.`);
        console.log(`Image cleanup will be handled by the middleware.`);
      } else {
        console.log(`Home with ID ${homeId} not found for deletion.`);
      }
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error deleting home:", err);
      res.redirect("/host/host-home-list");
    });
};

// API versions for React frontend
exports.apiGetHostHomes = async (req, res) => {
  try {
    const homes = await Home.find();
    res.json(homes);
  } catch (err) {
    console.error('apiGetHostHomes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.apiPostAddHome = async (req, res) => {
  try {
    const { houseName, price, houseLocation, rating, description } = req.body;
    const houseImage = req.file ? req.file.path.replace(/\\/g, '/') : undefined;
    const home = new Home({ houseName, price, houseLocation, rating, description, houseImage });
    await home.save();
    res.status(201).json(home);
  } catch (err) {
    console.error('apiPostAddHome error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.apiPostEditHome = async (req, res) => {
  try {
    const { houseName, price, houseLocation, rating, description } = req.body;
    const home = await Home.findById(req.params.homeId);
    if (!home) return res.status(404).json({ message: 'Home not found' });
    home.houseName = houseName;
    home.price = price;
    home.houseLocation = houseLocation;
    home.rating = rating;
    home.description = description;
    if (req.file) home.houseImage = req.file.path.replace(/\\/g, '/');
    await home.save();
    res.json(home);
  } catch (err) {
    console.error('apiPostEditHome error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.apiPostDeleteHome = async (req, res) => {
  try {
    await Home.findOneAndDelete({ _id: req.params.homeId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('apiPostDeleteHome error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};