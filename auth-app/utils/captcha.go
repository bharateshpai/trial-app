package utils

import (
	"auth-app/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

const recaptchaVerifyURL = "https://www.google.com/recaptcha/api/siteverify"

// VerifyCaptcha verifies the reCAPTCHA token with Google's API
func VerifyCaptcha(token string) (*models.CaptchaResponse, error) {
	if token == "" {
		return nil, fmt.Errorf("no captcha token provided")
	}

	secretKey := os.Getenv("RECAPTCHA_SECRET_KEY")
	if secretKey == "" {
		return nil, fmt.Errorf("RECAPTCHA_SECRET_KEY not set")
	}

	// Prepare form data
	formData := url.Values{
		"secret":   {secretKey},
		"response": {token},
	}

	// Make request to Google's verification API
	resp, err := http.PostForm(recaptchaVerifyURL, formData)
	if err != nil {
		return nil, fmt.Errorf("failed to verify captcha: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	var captchaResp models.CaptchaResponse
	if err := json.Unmarshal(body, &captchaResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}

	return &captchaResp, nil
} 