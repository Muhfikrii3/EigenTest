const BookRepository = require("../src/infrastructure/repositories/BookRepository");
const MemberRepository = require("../src/infrastructure/repositories/MemberRepository");
const LibraryService = require("../src/application/services/LibraryService");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

describe("Library Service", () => {
	let libraryService;
	let mongod;

	beforeAll(async () => {
		mongod = await MongoMemoryServer.create();
		const uri = mongod.getUri();
		await mongoose.connect(uri);
		const bookRepo = new BookRepository();
		const memberRepo = new MemberRepository();
		libraryService = new LibraryService(bookRepo, memberRepo);
	});

	beforeEach(async () => {
		await mongoose.connection.db.dropDatabase();

		const BookModel = require("../src/infrastructure/models/BookModel");
		const MemberModel = require("../src/infrastructure/models/MemberModel");

		await BookModel.insertMany([
			{
				code: "JK-45",
				title: "Harry Potter",
				author: "J.K Rowling",
				stock: 1,
			},
			{
				code: "SHR-1",
				title: "A Study in Scarlet",
				author: "Arthur Conan Doyle",
				stock: 1,
			},
			{
				code: "TW-11",
				title: "Twilight",
				author: "Stephenie Meyer",
				stock: 1,
			},
		]);

		await MemberModel.insertMany([
			{ code: "M001", name: "Angga" },
			{ code: "M002", name: "Ferry" },
		]);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongod.stop();
	});

	test("Member should borrow a book successfully", async () => {
		const result = await libraryService.borrowBook("M001", "JK-45");
		expect(result.success).toBe(true);
		expect(result.message).toBe("Book borrowed successfully");
	});

	test("Member should not borrow more than 2 books", async () => {
		await libraryService.borrowBook("M001", "JK-45");
		await libraryService.borrowBook("M001", "SHR-1");
		const result = await libraryService.borrowBook("M001", "TW-11");
		expect(result.success).toBe(false);
		expect(result.message).toBe(
			"Member cannot borrow more books or is penalized"
		);
	});

	test("Member should return a book with penalty if returned late", async () => {
		await libraryService.borrowBook("M001", "JK-45");

		const MemberModel = require("../src/infrastructure/models/MemberModel");
		const member = await MemberModel.findOne({ code: "M001" });

		if (member.borrowedBooks.length > 0) {
			member.borrowedBooks[0].borrowDate = new Date(
				Date.now() - 8 * 24 * 60 * 60 * 1000
			);
			await member.save();

			const result = await libraryService.returnBook("M001", "JK-45");

			expect(result.success).toBe(true);
			expect(result.message).toBe("Book returned with penalty");
		} else {
			throw new Error("Member has no borrowed books");
		}
	});
});
