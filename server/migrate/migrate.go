package main

import (
	"log"

	"github.com/a-deola/SkyCast/initializers"
	"github.com/a-deola/SkyCast/models"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
}

func main() {
	if err := initializers.DB.AutoMigrate(&models.Weather{}, &models.WeatherCondition{}); err != nil {
		log.Fatalf("Failed to auto-migrate the database schema: %v", err)
	}

}
