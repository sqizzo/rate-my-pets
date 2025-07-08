const emailVerificationMiddleware = (req, res, next) => {
	if (!req.user.isEmailVerified) {
		return res.status(403).json({
			error: 'Email verification required',
			message:
				'Please verify your email address before accessing this resource',
		});
	}
	next();
};

module.exports = emailVerificationMiddleware;
