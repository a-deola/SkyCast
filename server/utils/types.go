package types

type Input struct {
	Lat float64
	Lon float64
}
type Output struct {
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

type GeocodingResponse struct {
	Name       string             `json:"name"`
	Lat        float64            `json:"lat"`
	Lon        float64            `json:"lon"`
	Country    string             `json:"country"`
	State      string             `json:"state"`
	LocalNames *map[string]string `json:"local_names,omitempty"`
}
