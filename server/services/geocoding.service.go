package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	types "github.com/a-deola/SkyCast/utils"
)

func FetchCoordinates(city string, apiKey string) (types.Input, error) {
	geocodingURL := fmt.Sprintf("http://api.openweathermap.org/geo/1.0/direct?q=%s&limit=1&appid=%s", city, apiKey)

	resp, err := http.Get(geocodingURL)
	if err != nil {
		return types.Input{}, fmt.Errorf("failed to fetch geocoding data")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return types.Input{}, fmt.Errorf("unexpected status code %d: %s", resp.StatusCode, resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return types.Input{}, fmt.Errorf("failed to read geocoding data")
	}

	var results []types.GeocodingResponse
	if err := json.Unmarshal(body, &results); err != nil {
		return types.Input{}, fmt.Errorf("failed to unmarshal geocoding data: %v", err)
	}

	if len(results) == 0 {
		return types.Input{}, fmt.Errorf("coordinates not found")
	}
	coords := types.Input{
		Lat: results[0].Lat,
		Lon: results[0].Lon,
	}
	return coords, nil

}
