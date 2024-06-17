package main

import (
	"github.com/a-deola/SkyCast/initializers"
	"github.com/a-deola/SkyCast/models"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
}

func main() {
	initializers.DB.AutoMigrate(&models.Weather{})
}
