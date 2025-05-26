package main

import (
	"auth-app/handlers"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize user store
	if err := handlers.InitializeStore(); err != nil {
		log.Fatal("Failed to initialize user store:", err)
	}

	r := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // React app default port
	config.AllowMethods = []string{"GET", "POST", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}
	
	r.Use(cors.New(config))

	// Routes
	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)
	r.POST("/forgot-password", handlers.ForgotPassword)
	r.POST("/reset-password", handlers.ResetPassword)

	// Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
} 