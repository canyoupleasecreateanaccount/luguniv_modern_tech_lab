const express = require("express");
const {host, port} = require("./configuration");



let app = express();

app.set('view engine', 'hbs');

app.get('/health-check', (req, res) => {
    res.status(200).json({"status": "ok"})
})


app.listen(port, () => {
    console.log(`Auth service is working on port ${port}`);
    console.log(`Host is ${host}`)
});