const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (user) => {
	return new User({}).save();
};

