const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: String,
    bannerImage: String,
    channelDescription: String,
    createdAt: { type: Date, default: Date.now },
    country: String,
    isVerified: { type: Boolean, default: false },
    customUrl: String,
    category: String,
    socialLinks: {
        twitter: String,
        instagram: String,
        website: String
    },
    subscribers: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    videoCount: { type: Number, default: 0 },
    lastLogin: Date,
    lastUpdated: { type: Date, default: Date.now },
    status: { type: String, default: 'active' }
});

module.exports = mongoose.model('User', userSchema);
