package handlers

import (
	"auth-app/models"
	"auth-app/storage"
	"auth-app/utils"
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"net/smtp"
	"os"

	"github.com/gin-gonic/gin"
)

var userStore *storage.UserStore

func InitializeStore() error {
	var err error
	userStore, err = storage.NewUserStore("users.json")
	return err
}

// Register handles user registration
func Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request payload"})
		return
	}

	_, exists := userStore.GetUser(user.Username)
	if exists {
		c.JSON(http.StatusConflict, models.ErrorResponse{Error: "Username already exists"})
		return
	}

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to hash password"})
		return
	}

	err = userStore.AddUser(user.Username, hashedPassword, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to save user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

// Login handles user authentication
func Login(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request payload"})
		return
	}

	// Verify CAPTCHA
	if user.CaptchaToken != "" {
		captchaResp, err := utils.VerifyCaptcha(user.CaptchaToken)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Failed to verify CAPTCHA"})
			return
		}
		if !captchaResp.Success {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid CAPTCHA"})
			return
		}
	}

	storedUser, exists := userStore.GetUser(user.Username)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Invalid credentials"})
		return
	}

	if !utils.CheckPasswordHash(user.Password, storedUser.Password) {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, models.LoginResponse{Token: token})
}

// ForgotPassword initiates the password reset process
func ForgotPassword(c *gin.Context) {
	var req models.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request payload"})
		return
	}

	user, exists := userStore.GetUserByEmail(req.Email)
	if !exists {
		// For security reasons, always return success even if email doesn't exist
		c.JSON(http.StatusOK, gin.H{"message": "If the email exists, you will receive reset instructions"})
		return
	}

	// Generate reset token
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to generate reset token"})
		return
	}
	resetToken := hex.EncodeToString(tokenBytes)

	// Save reset token
	if err := userStore.SetResetToken(user.Username, resetToken); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to process reset request"})
		return
	}

	// Send email with reset link
	go sendResetEmail(user.Email, resetToken)

	c.JSON(http.StatusOK, gin.H{"message": "If the email exists, you will receive reset instructions"})
}

// ResetPassword handles the password reset
func ResetPassword(c *gin.Context) {
	var req models.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request payload"})
		return
	}

	// Find user by reset token
	var foundUser storage.User
	var foundUsername string
	for username, user := range userStore.Users {
		if user.ResetToken == req.Token {
			foundUser = user
			foundUsername = username
			break
		}
	}

	if foundUsername == "" || !userStore.ValidateResetToken(foundUsername, req.Token) {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid or expired reset token"})
		return
	}

	// Hash and update the new password
	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to hash password"})
		return
	}

	if err := userStore.UpdatePassword(foundUsername, hashedPassword); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}

func sendResetEmail(email, token string) {
	// Replace these with your email configuration
	from := os.Getenv("EMAIL_FROM")
	password := os.Getenv("EMAIL_PASSWORD")
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// Create reset link
	resetLink := "http://localhost:3000/reset-password?token=" + token

	// Email content
	to := []string{email}
	subject := "Password Reset Request"
	body := "Click the following link to reset your password: " + resetLink + "\n\nThis link will expire in 15 minutes."

	message := []byte("From: " + from + "\r\n" +
		"To: " + email + "\r\n" +
		"Subject: " + subject + "\r\n\r\n" +
		body)

	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Send email
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
	if err != nil {
		// Log the error but don't return it to maintain security
		println("Failed to send email:", err.Error())
	}
} 