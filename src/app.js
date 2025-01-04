const express = require("express");
const hbs = require("hbs");
const axios = require("axios");
const path = require('path');


const fs = require("fs");

let data = fs.readFileSync("data/cities.json", "utf-8");
let cities = JSON.parse(data);


let app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));



hbs.registerPartials(path.join(__dirname, 'views/layouts'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));



app.get('/', (req, res) => {
    data = {
        title: "Головна сторінка",
        description: "Отримайте останню інформацію про погоду у вашому місті"
    }
    res.render("homepage.hbs", data);
});


app.get('/weather/:city?', async (req, res) => {

    const cityFromPath = req.params.city;
    const cityFromQuery = req.query.city;

    const city = cityFromPath || cityFromQuery;

    if (city === undefined) {
        res.render("cities-list.hbs", { cities })
    } else {
        const apiResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bd5e378503939ddaee76f12ad7a97608&mode=html`);
        const weatherInfo = apiResponse.data;

        res.render("weather.hbs", {weatherInfo})
    }
});


app.get('/login', (req, res) => {
    res.send("Hello, It's login page");
});

app.listen(3000, () => {
});