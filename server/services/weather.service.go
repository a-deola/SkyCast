// services/weather.go

package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/a-deola/SkyCast/initializers"
	"github.com/a-deola/SkyCast/models"
	types "github.com/a-deola/SkyCast/utils"
	"github.com/gofiber/fiber/v2"
)

var weatherData models.Weather

func ValidateCache(c *fiber.Ctx, req types.Input) error {

	result := initializers.DB.Model(&models.Weather{}).Preload("Conditions").Where("Lat = ? AND Lon = ?", req.Lat, req.Lon).
		First(&weatherData)

	if result.Error == nil && (time.Since(weatherData.UpdatedAt).Hours()) < (3*time.Hour).Hours() {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"weather": weatherData,
			"message": "Returning cached data"})
	}

	fmt.Println("No cache data found .......")

	return nil

}

func FetchWeatherData(lat, lon float64) (models.Weather, error) {
	var apiKey = os.Getenv("WEATHER_API_KEY")

	// Build the URL for OpenWeatherMap API call
	url := fmt.Sprintf("https://api.openweathermap.org/data/2.5/forecast?lat=%f&lon=%f&appid=%s&units=metric&cnt=40", lat, lon, apiKey)

	if apiKey == "" {
		return models.Weather{}, errors.New("API_KEY is missing")
	}

	// Fetch the data from OpenWeatherMap
	resp, err := http.Get(url)
	if err != nil {
		return weatherData, errors.New("failed to fetch weather data")
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return weatherData, errors.New("failed to read response body")
	}

	var weatherResponse types.Output
	if err := json.Unmarshal(body, &weatherResponse); err != nil {
		return weatherData, errors.New("failed to parse response")
	}

	// Populate weather data struct
	weatherData.Name = weatherResponse.City.Name
	weatherData.Country = weatherResponse.City.Country
	weatherData.Timezone = weatherResponse.City.Timezone
	weatherData.Sunrise = weatherResponse.City.Sunrise
	weatherData.Sunset = weatherResponse.City.Sunset
	weatherData.Lat = lat
	weatherData.Lon = lon
	weatherData.Conditions = []models.WeatherCondition{}

	// Iterate through the response list and add conditions to the weather data
	for _, item := range weatherResponse.List {
		condition := models.WeatherCondition{
			Date:             item.Dt,
			Temp:             item.Main.Temp,
			TempMin:          item.Main.Temp_Min,
			TempMax:          item.Main.Temp_Max,
			Pressure:         item.Main.Pressure,
			Humidity:         item.Main.Humidity,
			CurrentCondition: item.Weather[0].Main,
			Description:      item.Weather[0].Description,
			Icon:             item.Weather[0].Icon,
			Clouds:           item.Clouds.All,
			Visibility:       item.Visibility,
			WindSpeed:        item.Wind.Speed,
			Rain:             item.Rain.ThreeHour,
			DtTxt:            item.Dt_txt,
		}
		weatherData.Conditions = append(weatherData.Conditions, condition)
	}
	return weatherData, nil
}

func SaveWeatherData(weatherData models.Weather) (models.Weather, error) {
	result := initializers.DB.Where("Lat = ? AND Lon = ?", weatherData.Lat, weatherData.Lon).Save(&weatherData)
	if result.Error != nil {
		return weatherData, result.Error
	}
	return weatherData, nil
}
