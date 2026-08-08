const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    banner: {
      type: [String],
      default: [],
    },
    categories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);