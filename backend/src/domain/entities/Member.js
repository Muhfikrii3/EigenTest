class Member {
	constructor(code, name) {
		this.code = code;
		this.name = name;
		this.borrowedBooks = [];
		this.penaltyEndDate = null;
	}

	canBorrow() {
		const today = new Date();

		if (this.penaltyEndDate && today < this.penaltyEndDate) {
			return false;
		}

		return this.borrowedBooks.length < 2;
	}

	borrowBook(bookCode) {
		if (this.canBorrow()) {
			this.borrowedBooks.push({
				bookCode,
				borrowDate: new Date(),
			});
			return true;
		}
		return false;
	}

	returnBook(bookCode) {
		const borrowedBook = this.borrowedBooks.find(
			(b) => b.bookCode === bookCode
		);

		if (borrowedBook) {
			const daysBorrowed =
				(new Date() - new Date(borrowedBook.borrowDate)) /
				(1000 * 60 * 60 * 24);
			this.borrowedBooks = this.borrowedBooks.filter(
				(b) => b.bookCode !== bookCode
			);
			return daysBorrowed;
		}

		return null;
	}

	applyPenalty() {
		this.penaltyEndDate = new Date();
		this.penaltyEndDate.setDate(this.penaltyEndDate.getDate() + 3);
	}
}

module.exports = Member;
