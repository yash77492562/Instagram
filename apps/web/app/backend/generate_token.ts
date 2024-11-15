import crypto from 'crypto';

// Generate a secure HMAC token from the account number
const salt = process.env.SECRET_KEY ;

export function generateSecureTokenWithSalt(input: string): string {
    return crypto.createHash('sha256').update(input + salt).digest('hex');
}