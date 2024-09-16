const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
	code: { type: String, required: true },
	name: { type: String, required: true },
	borrowedBooks: [
		{
			bookCode: String,
			borrowDate: Date,
		},
	],
	penaltyEndDate: Date,
});

const MemberModel = mongoose.model("Member", MemberSchema);
module.exports = MemberModel;
