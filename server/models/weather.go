package models

import (
	"gorm.io/gorm"
)

type Weather struct {
	gorm.Model
	Lon         float64
	Lat         float64
	Condition   string
	Icon        string
	Description string
	Rain        float64
	Temperature float64
	Feels_Like  float64
	Temp_Min    float64
	Temp_Max    float64
	Pressure    int
	Humidity    int
	Visibility  int
	WindSpeed   float64
	Country     string
	Timezone    int
	City        string
}
