# 🌤️ SkyCast

**SkyCast** is a sleek weather app built with **Vite** on the frontend and **Fiber (Go)** on the backend. It fetches real-time weather data using the **OpenWeather API** and displays it with speed and simplicity.

## 🚀 Tech Stack

- **Frontend**: [Vite](https://vitejs.dev/) + JavaScript/TypeScript  
- **Backend**: [Fiber](https://gofiber.io/) — an Express-inspired web framework for Go  
- **API**: [OpenWeather API](https://openweathermap.org/api)

## 🔍 Features

- 🌡️ Current weather by city  
- 📍 Geolocation-based weather 
- 💨 Feels like, wind speed, humidity, and more  
- 🌈 Clean, minimal UI  
- ⚡ Fast load time thanks to Vite + Fiber combo

## 🛠️ Getting Started

### 📦 Prerequisites
- Node.js  
- Go (1.20+)  
- OpenWeather API key (get one [here](https://home.openweathermap.org/api_keys))

### 📁 Clone the repo
```bash
git clone https://github.com/a-deola/SkyCast.git
cd SkyCast
```

### 🔧 Backend Setup (Fiber)
```bash
cd server
go run main.go
```

### 💻 Frontend Setup (Vite)
```bash
cd client
npm install
npm run dev
```

> Make sure your backend is running on a port the frontend can reach (e.g., `http://localhost:3000`), and that the OpenWeather API key is correctly loaded in your `.env`.

## 🌍 Demo

[here](https://a-deola.github.io/SkyCast/)

## 🤝 Contributing

Feel free to fork the repo, open issues, or make pull requests. Suggestions are welcome!

## 📄 License

MIT © [adeola](https://github.com/a-deola)
