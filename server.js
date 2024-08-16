//server
const express = require("express");
const axios = require("axios");
const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve the public folder as static files
app.use(express.static("public"));

// Render the index template with default values for weather and error
app.get("/", (req, res) => {
    res.render("index", { weather: null, error: null });
});

// Handle the /weather route
app.get("/weather", async(req, res) => {
    const city = req.query.city;
    const apiKey = "7e100148a4279af1a591f2576ca7b5ec";

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            axios.get(currentWeatherUrl),
            axios.get(forecastUrl)
        ]);

        const weather = currentWeatherResponse.data;
        const forecast = forecastResponse.data;

        // Filter forecast to get data for only 3 days (24 * 3 = 72 entries)
        const filteredForecast = forecast.list.filter((forecastItem, index) => {
            return index < 1 * 3; // 3 hari ke depan (8 data per hari karena 3 jam interval)
        });

        res.render("index", { weather, forecast: { list: filteredForecast }, error: null });
    } catch (error) {
        res.render("index", { weather: null, forecast: null, error: "Error, Please try again" });
    }
});




// Start the server and listen on port 3000 or the value of the PORT environment variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});