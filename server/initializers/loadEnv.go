package initializers

import (
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	db, api := os.Getenv("DB_DSN"), os.Getenv("WEATHER_API_KEY")
	if db == "" && api == "" {
		godotenv.Load()
	} else {
		return
	}
}
