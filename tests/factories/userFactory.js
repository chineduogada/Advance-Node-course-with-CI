const mongoose = require("mongoose");
const User = mongoose.model("User");
const Blog = mongoose.model("Blog");

module.exports = async (userId) => {
	// Cleanup all existing user data
	if (userId) {
		await User.findOneAndRemove({ _id: userId });
		await Blog.findOneAndRemove({ _user: userId });
	} else {
		return await User.create({});
	}
};

