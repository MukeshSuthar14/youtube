const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnalyticsSchema = new Schema({
  watchTime: { type: Number, default: 0 },
  averageViewDuration: { type: Number, default: 0 }
}, { _id: false });

const VideoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  slug: { type: String, unique: true },

  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  duration: { type: Number }, // in seconds
  resolution: [{ type: String }], // e.g., ["720p", "1080p"]

  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },

  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  category: { type: String },
  tags: [{ type: String }],

  isPublished: { type: Boolean, default: false },

  publishDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  visibility: { type: String, enum: ['public', 'private', 'unlisted'], default: 'public' },
  status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'ready' },

  analytics: AnalyticsSchema,

  location: {
    country: { type: String },
    city: { type: String }
  },

  reported: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
});

const Video = mongoose.model('Video', VideoSchema);
module.exports = Video;
