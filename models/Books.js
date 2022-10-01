const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    ref:"User",
  }, 
  createdBy: {
    type: String,
    default: "User",
  },
  holdBook: {
    type: [{
      type: String,
      ref: "User",  
    }],
    default: [],
  },
});

module.exports = mongoose.model("Book", BookSchema);
