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
	"gorm.io/gorm"
)

type input struct {
	Lat float64
	Lon float64
}
type output struct {
	List []struct {
		Dt   int
		Main struct {
			Temp       float64
			Feels_Like float64
			Temp_Min   float64
			Temp_Max   float64
			Pressure   int
			Humidity   int
		}
		Weather []struct {
			ID          int
			Main        string
			Description string
			Icon        string
		}
		Clouds struct {
			All int
		}

		Visibility int
		Wind       struct {
			Speed float64
			Deg   int
		}
		Rain struct {
			ThreeHour float64 `json:"3h"`
		}
		Dt_txt string
	}
	City struct {
		Name  string
		Coord struct {
			Lon float64
			Lat float64
		}
		Country  string
		Timezone int
		Sunrise  int
		Sunset   int
	}
}

var weatherData models.Weather
var result *gorm.DB

func validateCache(c *fiber.Ctx, req *input) error {
	result = initializers.DB.Model(&models.Weather{}).Preload("Conditions").Where("Lat = ? AND Lon = ?", req.Lat, req.Lon).
		First(&weatherData)

	if result.Error == nil && (time.Since(weatherData.UpdatedAt).Hours()) < (3*time.Hour).Hours() {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"weather": weatherData,
			"message": "Returning cached data"})
	} else {
		fmt.Println("No cache data found .......")
	}

	return nil

}

func WeatherCreate(c *fiber.Ctx) error {
	var req input
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
	}

	if err := validateCache(c, &req); err != nil {
		return err
	}

	apiKey := os.Getenv("WEATHER_API_KEY")
	url := fmt.Sprintf("https://api.openweathermap.org/data/2.5/forecast?lat=%f&lon=%f&appid=%s&units=metric&cnt=40",
		req.Lat, req.Lon, apiKey)

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

	weatherData.Lon = req.Lon
	weatherData.Lat = req.Lat
	weatherData.Country = weather.City.Country
	weatherData.Timezone = weather.City.Timezone
	weatherData.Name = weather.City.Name
	weatherData.Sunrise = weather.City.Sunrise
	weatherData.Sunset = weather.City.Sunset
	weatherData.Conditions = []models.WeatherCondition{}

	for _, w := range weather.List {
		condition := models.WeatherCondition{
			Date:             w.Dt,
			Temp:             w.Main.Temp,
			FeelsLike:        w.Main.Feels_Like,
			TempMin:          w.Main.Temp_Min,
			TempMax:          w.Main.Temp_Max,
			Pressure:         w.Main.Pressure,
			Humidity:         w.Main.Humidity,
			CurrentCondition: w.Weather[0].Main,
			Description:      w.Weather[0].Description,
			Icon:             w.Weather[0].Icon,
			Clouds:           w.Clouds.All,
			Visibility:       w.Visibility,
			WindSpeed:        w.Wind.Speed,
			WindDeg:          w.Wind.Deg,
			Rain:             w.Rain.ThreeHour,
			DtTxt:            w.Dt_txt,
		}
		weatherData.Conditions = append(weatherData.Conditions, condition)
	}

	result = initializers.DB.Where("Lat=? AND Lon= ?", req.Lat, req.Lon).
		Save(&weatherData)
	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error})
		return result.Error
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"weather": weatherData, "message": "Weather data saved successfully!"})

}

func WeatherGet(c *fiber.Ctx) error {
	var weatherRecords []models.Weather
	initializers.DB.Find(&weatherRecords)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"weather": weatherRecords})
}
