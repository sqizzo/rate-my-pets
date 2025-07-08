// Test script for email verification functionality
// This script demonstrates the email verification flow

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEmailVerification() {
	console.log('🧪 Testing Email Verification Flow...\n');

	try {
		// 1. Register a new user
		console.log('1. Registering a new user...');
		const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
		});
		console.log(
			'✅ Registration successful:',
			registerResponse.data.message
		);
		console.log('📧 Verification email should be sent\n');

		// 2. Try to login without verification (should fail)
		console.log('2. Attempting to login without email verification...');
		try {
			await axios.post(`${BASE_URL}/auth/login`, {
				email: 'test@example.com',
				password: 'password123',
			});
		} catch (error) {
			if (error.response?.status === 401) {
				console.log(
					'✅ Login correctly blocked - email verification required'
				);
				console.log('📝 Error message:', error.response.data.error);
			}
		}
		console.log('');

		// 3. Resend verification email
		console.log('3. Resending verification email...');
		const resendResponse = await axios.post(
			`${BASE_URL}/auth/resend-verification`,
			{
				email: 'test@example.com',
			}
		);
		console.log('✅ Resend successful:', resendResponse.data.message);
		console.log('');

		console.log('📋 Next steps:');
		console.log('1. Check your email for the verification link');
		console.log('2. Click the verification link to verify your email');
		console.log('3. Try logging in again - it should work now');
		console.log(
			'4. Try creating a post - it should work for verified users'
		);
	} catch (error) {
		console.error('❌ Test failed:', error.response?.data || error.message);
	}
}

// Run the test if this file is executed directly
if (require.main === module) {
	testEmailVerification();
}

module.exports = { testEmailVerification };
