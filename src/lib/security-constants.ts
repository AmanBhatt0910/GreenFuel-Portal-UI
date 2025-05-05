// Security constants for the application
// These constants are used for authentication and security features

// Maximum number of login attempts before account lockout
export const MAX_LOGIN_ATTEMPTS = 3;

// Duration of account lockout after exceeding maximum login attempts (5 minutes in milliseconds)
export const LOCK_DURATION = 5 * 60 * 1000;