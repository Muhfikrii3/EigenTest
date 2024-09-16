const express = require("express");
const router = express.Router();

const BookRepository = require("../../infrastructure/repositories/BookRepository");
const MemberRepository = require("../../infrastructure/repositories/MemberRepository");
const LibraryService = require("../../application/services/LibraryService");

const bookRepo = new BookRepository();
const memberRepo = new MemberRepository();
const libraryService = new LibraryService(bookRepo, memberRepo);

/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowRequest:
 *       type: object
 *       required:
 *         - memberCode
 *         - bookCode
 *       properties:
 *         memberCode:
 *           type: string
 *           description: The code of the member borrowing the book
 *         bookCode:
 *           type: string
 *           description: The code of the book being borrowed
 *     ReturnRequest:
 *       type: object
 *       required:
 *         - memberCode
 *         - bookCode
 *       properties:
 *         memberCode:
 *           type: string
 *           description: The code of the member returning the book
 *         bookCode:
 *           type: string
 *           description: The code of the book being returned
 *     ResponseMessage:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the operation was successful
 *         message:
 *           type: string
 *           description: The message detailing the result of the operation
 */

/**
 * @swagger
 * /api/borrow:
 *   post:
 *     summary: Borrow a book
 *     description: Allows a member to borrow a book if they meet all conditions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowRequest'
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseMessage'
 *       400:
 *         description: Error in borrowing book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseMessage'
 */
router.post("/borrow", async (req, res) => {
	const { memberCode, bookCode } = req.body;

	if (!memberCode || !bookCode) {
		return res
			.status(400)
			.json({
				success: false,
				message: "Missing memberCode or bookCode",
			});
	}

	try {
		const result = await libraryService.borrowBook(memberCode, bookCode);
		return res.status(result.success ? 200 : 400).json(result);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal server error", error });
	}
});

/**
 * @swagger
 * /api/return:
 *   post:
 *     summary: Return a book
 *     description: Allows a member to return a book and apply penalty if returned late
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReturnRequest'
 *     responses:
 *       200:
 *         description: Book returned successfully with or without penalty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseMessage'
 *       400:
 *         description: Error in returning book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseMessage'
 */
router.post("/return", (req, res) => {
	const { memberCode, bookCode } = req.body;
	const result = libraryService.returnBook(memberCode, bookCode);
	return res.status(result.success ? 200 : 400).json(result);
});

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get available books
 *     description: Returns a list of all available books
 *     responses:
 *       200:
 *         description: A list of available books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   stock:
 *                     type: integer
 *     tags:
 *       - Books
 */
router.get("/books", async (req, res) => {
	try {
		const availableBooks = await libraryService.getAvailableBooks();
		return res.status(200).json(availableBooks);
	} catch (err) {
		return res
			.status(500)
			.json({ availableBooks: "Error retrieving books" });
	}
});

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get member status
 *     description: Returns a list of all members and their borrowing status
 *     responses:
 *       200:
 *         description: A list of members and their statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   name:
 *                     type: string
 *                   borrowedBooks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         bookCode:
 *                           type: string
 *                         borrowDate:
 *                           type: string
 *                           format: date-time
 *                   penaltyEndDate:
 *                     type: string
 *                     format: date-time
 *     tags:
 *       - Members
 */
router.get("/members", async (req, res) => {
	try {
		const members = await libraryService.getMembersStatus();
		return res.status(200).json(members);
	} catch (err) {
		return res.status(500).json({ message: "Error retrieving members" });
	}
});

module.exports = router;
