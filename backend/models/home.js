const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    houseName: { type: String, required: true },
    price: { type: Number, required: true },
    houseLocation: { type: String, required: true },
    rating: { type: Number, required: true },
    houseImage: String,
    description: String,
});

// Middleware to clean up when a home is deleted
homeSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      // Import required modules
      const fs = require('fs');
      const path = require('path');
      const rootDir = require('../utils/pathUtil');
      
      // Delete the associated image file if it exists
      if (doc.houseImage) {
        const absoluteImagePath = path.join(rootDir, doc.houseImage);
        
        // Check if file exists and delete it
        if (fs.existsSync(absoluteImagePath)) {
          fs.unlinkSync(absoluteImagePath);
          console.log(`Image file deleted by middleware: ${absoluteImagePath}`);
        }
      }
      
      // TODO: Here you can also add code to clean up favourites if needed
      
    } catch (err) {
      console.error('Error in home deletion middleware:', err);
    }
  }
});

module.exports = mongoose.model('Home', homeSchema);
