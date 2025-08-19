const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    homeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index to ensure a user can only favorite a home once
favouriteSchema.index({ userId: 1, homeId: 1 }, { unique: true });

module.exports = mongoose.model('Favourite', favouriteSchema);
