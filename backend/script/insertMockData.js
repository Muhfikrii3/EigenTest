const mongoose = require("mongoose");
const config = require("../src/config/config");
const BookModel = require("../src/infrastructure/models/BookModel");
const MemberModel = require("../src/infrastructure/models/MemberModel");

const mockBooks = [
	{ code: "JK-45", title: "Harry Potter", author: "J.K Rowling", stock: 1 },
	{
		code: "SHR-1",
		title: "A Study in Scarlet",
		author: "Arthur Conan Doyle",
		stock: 1,
	},
	{ code: "TW-11", title: "Twilight", author: "Stephenie Meyer", stock: 1 },
	{ code: "HOB-83", title: "The Hobbit", author: "J.R.R. Tolkien", stock: 1 },
	{
		code: "NRN-7",
		title: "The Lion, the Witch and the Wardrobe",
		author: "C.S. Lewis",
		stock: 1,
	},
];

const mockMembers = [
	{ code: "M001", name: "Angga" },
	{ code: "M002", name: "Ferry" },
	{ code: "M003", name: "Putri" },
];

const insertMockData = async () => {
	try {
		await mongoose.connect(config.dbConnectionString);

		await BookModel.deleteMany({});
		await MemberModel.deleteMany({});

		await BookModel.insertMany(mockBooks);
		await MemberModel.insertMany(mockMembers);

		console.log("Mock data inserted successfully");
	} catch (err) {
		console.error("Error inserting mock data:", err);
	} finally {
		mongoose.connection.close();
	}
};

insertMockData();
