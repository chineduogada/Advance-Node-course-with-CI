const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (user) => {
	// id of a real user from the DB
	const sessionObj = {
		passport: { user: user._id.toString() },
	};

	// use Buffer to get the base64 encode (the `session` itself);
	const session = Buffer.from(JSON.stringify(sessionObj)).toString("base64");

	// use Keygrip to `sign` the `session`
	const signStr = "session=" + session;
	const sig = keygrip.sign(signStr);

	return {
		session,
		sig,
	};
};

