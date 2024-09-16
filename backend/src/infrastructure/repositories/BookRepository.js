const BookModel = require("../models/BookModel");

class BookRepository {
	async findByCode(code) {
		try {
			return await BookModel.findOne({ code });
		} catch (error) {
			console.error("Error finding book by code:", error);
			throw new Error("Unable to find book by code");
		}
	}

	async getAllAvailable() {
		try {
			return await BookModel.find({
				stock: { $gt: 0 },
				borrowedBy: null,
			}).lean();
		} catch (error) {
			console.error("Error getting available books:", error);
			throw new Error("Unable to get available books");
		}
	}

	async updateBook(book) {
		try {
			return await BookModel.findOneAndUpdate({ code: book.code }, book, {
				new: true,
			});
		} catch (error) {
			console.error("Error updating book:", error);
			throw new Error("Unable to update book");
		}
	}
}

module.exports = BookRepository;
