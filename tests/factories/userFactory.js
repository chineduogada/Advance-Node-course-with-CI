const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = async (userId) => {
	if (userId) {
		await User.findOneAndRemove({ _id: userId });
	} else {
		return await User.create({});
	}
};

