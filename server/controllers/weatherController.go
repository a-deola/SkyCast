package controllers

import (
	"os"

	"github.com/a-deola/SkyCast/services"
	types "github.com/a-deola/SkyCast/utils"
	"github.com/gofiber/fiber/v2"
)

func WeatherCreate(c *fiber.Ctx) error {
	var req types.Input

	// Parse the request body
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
	}

	// Validate cache
	if err := services.ValidateCache(c, req); err != nil {
		return err
	}

	// Fetch weather data
	weatherData, err := services.FetchWeatherData(req.Lat, req.Lon)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	// Save the weather data
	savedWeatherData, err := services.SaveWeatherData(weatherData)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Return the weather data
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"weather": savedWeatherData, "message": "Weather data saved successfully!"})
}

func GetWeatherByCity(c *fiber.Ctx) error {
	apiKey := os.Getenv("WEATHER_API_KEY")
	city := c.Query("city")
	if city == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "City name is required"})
	}

	// Fetch coordinates for the city
	coords, err := services.FetchCoordinates(city, apiKey)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	// Validate cache
	if err := services.ValidateCache(c, coords); err != nil {
		return err
	}

	// Fetch weather data
	weatherData, err := services.FetchWeatherData(coords.Lat, coords.Lon)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	// Save the weather data
	savedWeatherData, err := services.SaveWeatherData(weatherData)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Call WeatherCreate, it will access the coordinates from the context
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"city":      city,
		"latitude":  coords.Lat,
		"longitude": coords.Lon,
		"weather":   savedWeatherData,
	})
}
