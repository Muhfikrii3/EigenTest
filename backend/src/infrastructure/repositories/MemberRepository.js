const MemberModel = require("../models/MemberModel");

class MemberRepository {
	async findAll() {
		try {
			return await MemberModel.find().exec();
		} catch (err) {
			console.error("Error finding all members:", err);
			throw err;
		}
	}

	async findByCode(code) {
		try {
			const member = await MemberModel.findOne({ code });
			if (!member) {
				throw new Error(`Member with code ${code} not found`);
			}
			return member;
		} catch (err) {
			console.error(`Error finding member with code ${code}:`, err);
			throw err;
		}
	}
}

module.exports = MemberRepository;
