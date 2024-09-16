class LibraryService {
	constructor(bookRepo, memberRepo) {
		this.bookRepo = bookRepo;
		this.memberRepo = memberRepo;
	}

	async borrowBook(memberCode, bookCode) {
		const member = await this.memberRepo.findByCode(memberCode);
		const book = await this.bookRepo.findByCode(bookCode);

		if (!member || !book || book.stock <= 0) {
			return { success: false, message: "Cannot borrow book" };
		}

		member.borrowedBooks.push({ bookCode, borrowDate: new Date() });
		book.borrowedBy = memberCode;
		book.stock -= 1;

		await member.save();
		await book.save();

		return { success: true, message: "Book borrowed successfully" };
	}

	async returnBook(memberCode, bookCode) {
		const member = await this.memberRepo.findByCode(memberCode);
		const book = await this.bookRepo.findByCode(bookCode);

		if (!member || !book) {
			return { success: false, message: "Member or book not found" };
		}

		const borrowedBook = member.borrowedBooks.find(
			(b) => b.bookCode === bookCode
		);
		if (!borrowedBook) {
			return {
				success: false,
				message: "This book was not borrowed by the member",
			};
		}

		const daysBorrowed = Math.floor(
			(new Date() - new Date(borrowedBook.borrowDate)) /
				(1000 * 60 * 60 * 24)
		);
		member.borrowedBooks = member.borrowedBooks.filter(
			(b) => b.bookCode !== bookCode
		);

		book.borrowedBy = null;
		book.stock += 1;

		if (daysBorrowed > 7) {
			member.applyPenalty();
		}

		await member.save();
		await book.save();

		return {
			success: true,
			message:
				daysBorrowed > 7
					? "Book returned with penalty"
					: "Book returned successfully",
		};
	}

	async getAvailableBooks() {
		try {
			const availableBooks = await this.bookRepo.getAllAvailable();
			return availableBooks;
		} catch (error) {
			console.error("Error fetching available books:", error);
			throw new Error("Could not fetch available books");
		}
	}

	async getMembersStatus() {
		try {
			return await this.memberRepo.findAll();
		} catch (error) {
			console.error("Error getting members status:", error);
			throw error;
		}
	}
}

module.exports = LibraryService;
