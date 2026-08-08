const Admin = require("../models/Admin");

// Get admin config (banner + categories)
const getAdminConfig = async (req, res) => {
  try {
    let config = await Admin.findOne();
    if (!config) {
      config = await Admin.create({ banner: [], categories: [] });
    }
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update admin config (banner + categories)
const updateAdminConfig = async (req, res) => {
  try {
    let config = await Admin.findOne();
    if (!config) {
      config = await Admin.create(req.body);
    } else {
      config = await Admin.findByIdAndUpdate(config._id, req.body, { new: true });
    }
    res.status(200).json({ message: "Admin config updated", config });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAdminConfig, updateAdminConfig };