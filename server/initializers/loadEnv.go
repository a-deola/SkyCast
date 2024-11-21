package initializers

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
	}

	db := os.Getenv("DB_DSN")
	api := os.Getenv("WEATHER_API_KEY")

	if db == "" {
		log.Println("DB_DSN not set")
	}
	if api == "" {
		log.Println("WEATHER_API_KEY not set")
	}
}
