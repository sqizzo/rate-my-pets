# Email Verification Implementation

This document describes the email verification system implemented for the Rate My Pets API.

## Overview

The email verification system ensures that users verify their email addresses before they can fully interact with the platform. This helps prevent fake accounts and ensures better user engagement.

## Features

### 1. **Automatic Email Verification on Registration**

-   When a user registers, a verification email is automatically sent
-   The user account is created but marked as unverified
-   Verification tokens expire after 24 hours

### 2. **Email Verification Required for Login**

-   Users cannot log in until their email is verified
-   Clear error messages guide users to verify their email

### 3. **Protected Actions Require Verification**

-   Creating posts requires email verification
-   Creating comments requires email verification
-   Other actions may be protected as needed

### 4. **Resend Verification Email**

-   Users can request a new verification email if the original expires
-   New tokens are generated for each resend request

## Database Schema Changes

### User Model Updates

```javascript
{
  // ... existing fields ...
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
}
```

## API Endpoints

### 1. **Registration** - `POST /api/auth/register`

**Request:**

```json
{
	"username": "testuser",
	"email": "test@example.com",
	"password": "password123"
}
```

**Response:**

```json
{
	"message": "User registered successfully. Please check your email to verify your account.",
	"userId": "user_id_here",
	"username": "testuser"
}
```

### 2. **Email Verification** - `GET /api/auth/verify-email?token=verification_token`

**Response:**

```json
{
	"message": "Email verified successfully!"
}
```

### 3. **Resend Verification** - `POST /api/auth/resend-verification`

**Request:**

```json
{
	"email": "test@example.com"
}
```

**Response:**

```json
{
	"message": "Verification email sent successfully"
}
```

### 4. **Login** - `POST /api/auth/login`

**Unverified User Response:**

```json
{
	"error": "Please verify your email address before logging in",
	"needsVerification": true
}
```

## Middleware

### 1. **Email Verification Middleware**

-   **File:** `middleware/emailVerification.js`
-   **Purpose:** Checks if user's email is verified before allowing access to protected routes
-   **Usage:** Applied to routes that require email verification

### 2. **Updated Auth Middleware**

-   **File:** `middleware/auth.js`
-   **Changes:** Now fetches complete user data including email verification status
-   **Purpose:** Provides email verification status to route handlers

## Email Configuration

### Environment Variables Required

```env
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

### Email Template

The verification email includes:

-   Welcome message with username
-   Verification link with token
-   24-hour expiration notice
-   Security disclaimer

## Security Features

### 1. **Token Security**

-   Tokens are hashed using SHA-256 before storage
-   Tokens expire after 24 hours
-   New tokens are generated for each resend request

### 2. **Database Security**

-   Sensitive fields are excluded from user queries
-   Password hashing remains unchanged
-   Email verification status is properly validated

### 3. **Error Handling**

-   Graceful handling of email sending failures
-   Registration continues even if email fails to send
-   Clear error messages for users

## Testing

### Test Script

Run the test script to verify the email verification flow:

```bash
npm run test:email
```

### Manual Testing Steps

1. Register a new user
2. Check email for verification link
3. Try to login without verification (should fail)
4. Click verification link
5. Login again (should succeed)
6. Try creating a post (should work)

## Frontend Integration

### 1. **Registration Flow**

-   Show success message after registration
-   Guide user to check email
-   Provide option to resend verification email

### 2. **Login Flow**

-   Handle `needsVerification` error
-   Show verification reminder
-   Provide resend verification option

### 3. **Protected Actions**

-   Handle 403 errors for unverified users
-   Show verification requirement message
-   Redirect to verification page if needed

## Error Codes

| Status | Error                                                | Description                                     |
| ------ | ---------------------------------------------------- | ----------------------------------------------- |
| 401    | `Please verify your email address before logging in` | Login attempted with unverified email           |
| 403    | `Email verification required`                        | Protected action attempted without verification |
| 400    | `Invalid or expired verification token`              | Invalid verification link                       |
| 400    | `Email is already verified`                          | Resend attempted for verified email             |

## Future Enhancements

1. **Email Templates**: Customizable email templates
2. **Verification Expiry**: Configurable token expiration time
3. **Rate Limiting**: Prevent abuse of resend functionality
4. **Admin Override**: Allow admins to verify users manually
5. **Bulk Operations**: Handle multiple verification requests

## Troubleshooting

### Common Issues

1. **Emails not sending**

    - Check Mailtrap credentials
    - Verify SMTP configuration
    - Check server logs for errors

2. **Verification links not working**

    - Ensure frontend URL is correct
    - Check token expiration
    - Verify token format

3. **Database connection issues**
    - Check MongoDB connection string
    - Verify database permissions
    - Check network connectivity

### Debug Mode

Enable debug logging by setting environment variable:

```env
DEBUG=email-verification
```
