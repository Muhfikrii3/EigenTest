const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
	code: { type: String, required: true, unique: true },
	title: { type: String, required: true },
	author: { type: String, required: true },
	stock: { type: Number, required: true },
	borrowedBy: { type: String, default: null },
});

BookSchema.methods.isAvailable = function () {
	return this.stock > 0 && this.borrowedBy === null;
};

BookSchema.methods.borrow = function (memberCode) {
	if (this.isAvailable()) {
		this.stock--;
		this.borrowedBy = memberCode;
		return true;
	}
	return false;
};

BookSchema.methods.returnBook = function () {
	if (this.borrowedBy !== null) {
		this.stock++;
		this.borrowedBy = null;
	}
};

module.exports = mongoose.model("Book", BookSchema);
