const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	isEmailVerified: {
		type: Boolean,
		default: false,
	},
	emailVerificationToken: String,
	emailVerificationExpires: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	passwordResetToken: String,
	passwordResetExpires: Date,

});

module.exports = mongoose.model('User', userSchema);
