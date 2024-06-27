package models

import (
	"gorm.io/gorm"
)

type WeatherCondition struct {
	ID               int `gorm:"primaryKey"`
	WeatherID        int `gorm:"index" `
	Date             int
	Temp             float64
	FeelsLike        float64
	TempMin          float64
	TempMax          float64
	Pressure         int
	Humidity         int
	CurrentCondition string
	Description      string
	Icon             string
	Clouds           int
	Visibility       int
	WindSpeed        float64
	WindDeg          int
	Rain             float64
	DtTxt            string
}

type Weather struct {
	gorm.Model
	CityName   string
	Lon        float64
	Lat        float64
	Country    string
	Timezone   int
	Sunrise    int
	Sunset     int
	Conditions []WeatherCondition
}
