package models

import (
	"gorm.io/gorm"
)

type Weather struct {
	gorm.Model
	City        string
	Temperature float64
	Condition   string
	Lon         float64
	Lat         float64
	Icon        string
}
