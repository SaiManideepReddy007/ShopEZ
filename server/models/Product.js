const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mainImg: {
      type: String,
      required: true,
    },
    carousel: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
    },
    sizes: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);