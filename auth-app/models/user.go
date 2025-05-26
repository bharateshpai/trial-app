package models

// User represents the user model
type User struct {
	Username     string `json:"username"`
	Password     string `json:"password"`
	Email        string `json:"email"`
	CaptchaToken string `json:"captchaToken,omitempty"`
}

// LoginResponse represents the response after successful login
type LoginResponse struct {
	Token string `json:"token"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}

// ForgotPasswordRequest represents a forgot password request
type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

// ResetPasswordRequest represents a password reset request
type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}

// CaptchaResponse represents Google reCAPTCHA verification response
type CaptchaResponse struct {
	Success     bool     `json:"success"`
	Score       float64  `json:"score"`
	Action      string   `json:"action"`
	ChallengeTS string   `json:"challenge_ts"`
	Hostname    string   `json:"hostname"`
	ErrorCodes  []string `json:"error-codes,omitempty"`
} 