const express = require("express");
const {host, port} = require("./configuration");



let app = express();

app.set('view engine', 'hbs');


app.listen(port, () => {
    console.log(`Auth service is working on port ${port}`);
    console.log(`Host is ${host}`)
});