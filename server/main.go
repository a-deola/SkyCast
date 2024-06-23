package main

import (
	"github.com/a-deola/SkyCast/controllers"
	"github.com/a-deola/SkyCast/initializers"
	"github.com/gofiber/fiber/v2"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
}
func main() {
	app := fiber.New()

	app.Post("/weather", controllers.WeatherCreate)

	app.Get("/weather", controllers.WeatherGet)

	app.Listen(":3000")
}
