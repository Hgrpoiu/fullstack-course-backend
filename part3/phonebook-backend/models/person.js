const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log(`Connecting to ${url}`);

mongoose
	.connect(url)
	.then(() => {
		console.log("connected");
	})
	.catch((error) => {
		console.log(`Error, ${error.message}`);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		minLength: 8,
		validate: {
			validator: function(v) {
				return /\d{2}-\d{6}/.test(v)||/\d{3}-\d{5}/.test(v);
			}
		},
		required: true,
	},
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
