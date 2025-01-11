const express = require("express");
const hbs = require("hbs");
const axios = require("axios");
const path = require('path');
const {host, port} = require("./configuration");
const {connectDB} = require("./helpers/dbHelper");
const User = require("./models/User");


const fs = require("fs");

let data = fs.readFileSync((path.join(__dirname, '/data/cities.json')), "utf-8");
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



app.get('/visitors-list', async (req, res) => {
    try {
        await connectDB();

        const users = await User.find();
        console.log(users);

        res.status(200).json({ users });
    } catch (error) {
        console.error('Помилка при отриманні відвідувачів:', error);
        res.status(500).json({ error: 'Помилка при отриманні відвідувачів' });
    }
});


app.get('/visitors/:visitorName?', async (req, res) => {
    const visitorName = req.params.visitorName || req.query.visitorName;
  
    try {
      await connectDB();
  
      const newUser = new User({
        name: visitorName
      });
  
      await newUser.save();
  
      console.log('Відвідувач доданий:', newUser);
      res.status(201).json({ message: 'Відвідувач доданий', user: newUser });
    } catch (error) {
      console.error('Помилка при додаванні відвідувача:', error);
      res.status(500).json({ error: 'Помилка при додаванні відвідувача' });
    }
  });


app.get('/login', (req, res) => {
    res.send("Hello, It's login page");
});



const startServer = () => {
    app.listen(port, () => {
        console.log(`API service is working on port ${port}`);
        console.log(`Host is ${host}`)
    });
}


(async () => {
    try {
      await connectDB();
      startServer();
    } catch (error) {
      console.error("DB connection failed:", error);
    }
})();