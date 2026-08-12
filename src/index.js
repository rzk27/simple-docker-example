const express = require('express');
const path = require("path");

const app = express();

app.get('/', async (request, response) => {

    response.sendFile(path.join(__dirname, "home.html"));

});

app.listen(process.env.PORT || 9000, () => console.log(`App available on http://localhost:9000`)) 