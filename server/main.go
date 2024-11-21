package main

import (
	"github.com/a-deola/SkyCast/controllers"
	"github.com/a-deola/SkyCast/initializers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
}
func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))

	app.Post("/weather", controllers.WeatherCreate)
	app.Get("/bycity", controllers.GetWeatherByCity)

	app.Listen(":3000")
}
