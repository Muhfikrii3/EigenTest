class Book {
	constructor(code, title, author, stock) {
		this.code = code;
		this.title = title;
		this.author = author;
		this.stock = stock;
		this.borrowedBy = null;
	}

	isAvailable() {
		return this.stock > 0 && this.borrowedBy === null;
	}

	borrow(memberCode) {
		if (this.isAvailable()) {
			this.stock--;
			this.borrowedBy = memberCode;
			return true;
		}
		return false;
	}

	returnBook() {
		if (this.borrowedBy !== null) {
			this.stock++;
			this.borrowedBy = null;
		}
	}
}

module.exports = Book;
