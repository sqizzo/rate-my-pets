const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
	// get header authorization
	const authHeader = req.get('authorization');

	// cek apakah token ada, dan formatnya Bearer token
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Missing or malformed token' });
	}

	// ambil bagian token tanpa bearer
	const token = authHeader.split('Bearer ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Fetch complete user data from database
		const user = await User.findById(decoded.id).select(
			'-passwordHash -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires'
		);

		if (!user) {
			return res.status(401).json({ error: 'User not found' });
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
};

module.exports = authMiddleware;
