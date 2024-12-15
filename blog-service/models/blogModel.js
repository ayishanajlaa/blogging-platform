const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');


const blogsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true })

const Blogs = mongoose.model("Blogs", blogsSchema);
module.exports = Blogs;
