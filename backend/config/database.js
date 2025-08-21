const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/youtube';

mongoose.connect(MONGO_URI).then(() => console.log('✅ Connected to MongoDB')).catch(err => console.error('❌ Failed to connect MongoDB', err));

module.exports = mongoose;