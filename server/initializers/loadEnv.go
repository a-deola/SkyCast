package initializers

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }
	db := os.Getenv("DB_DSN")
	api := os.Getenv("WEATHER_API_KEY")
	if db == "" || api == "" {
		return
	} else {
		godotenv.Load()
	}
	log.Println("DB_DSN: ", db)
}
