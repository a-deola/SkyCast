package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/a-deola/SkyCast/initializers"
	"github.com/a-deola/SkyCast/models"
	"github.com/gofiber/fiber/v2"
)

type input struct {
	Lat float64
	Lon float64
}
type output struct {
	Coord struct {
		Lon float64
		Lat float64
	}
	Weather []struct {
		Main        string
		Description string
		Icon        string
	}
	Main struct {
		Temp       float64
		Feels_Like float64
		Temp_Min   float64
		Temp_Max   float64
		Pressure   int
		Humidity   int
	}
	Visibility int
	Wind       struct {
		Speed float64
	}
	Rain struct {
		OneHour float64 `json:"1h"`
	}
	Sys struct {
		Country string
	}
	Timezone int
	Name     string
}

func WeatherCreate(c *fiber.Ctx) error {
	var req input
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
	}

	var weatherData models.Weather
	result := initializers.DB.Model(&models.Weather{}).Where("Lat = ? AND Lon = ?", req.Lat, req.Lon).First(&weatherData)

	if result.Error == nil && time.Since(weatherData.UpdatedAt) < 30*time.Minute {
		fmt.Println("Checking cache data .......")
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"found": weatherData, "message": "Returning cached data"})
	} else {
		fmt.Println("No cache data found .......")
	}

	apiKey := os.Getenv("WEATHER_API_KEY")
	url := fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?lat=%f&lon=%f&appid=%s&units=metric", req.Lat, req.Lon, apiKey)

	resp, err := http.Get(url)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to read response")
	}

	var weather output
	if err := json.Unmarshal(body, &weather); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to parse response")
	}
	weatherData = models.Weather{Lon: weather.Coord.Lon, Lat: weather.Coord.Lat, Condition: weather.Weather[0].Main, Description: weather.Weather[0].Description, Icon: weather.Weather[0].Icon, Temperature: weather.Main.Temp, Feels_Like: weather.Main.Feels_Like, Temp_Min: weather.Main.Temp_Min, Temp_Max: weather.Main.Temp_Max, Pressure: weather.Main.Pressure, Humidity: weather.Main.Humidity, Visibility: weather.Visibility, WindSpeed: weather.Wind.Speed, Rain: weather.Rain.OneHour, Country: weather.Sys.Country, Timezone: weather.Timezone, City: weather.Name}

	result = initializers.DB.Where("lat=? AND lon= ?", req.Lat, req.Lon).Save(&weatherData)
	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error})
		return result.Error
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"weather": weather, "message": "Weather data saved successfully!"})
}

func WeatherGet(c *fiber.Ctx) error {
	var weatherRecords []models.Weather
	initializers.DB.Find(&weatherRecords)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"weather": weatherRecords})
}
