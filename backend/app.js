const express = require("express");
const http = require('http');
const path = require("path");
const app = express();
const server = http.createServer(express);
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require("fs");

// required task
const createFolder = ["thumbnails", "videos", "banners", "images"];
for (var folder of createFolder) {
    if (!fs.existsSync(path.join(__dirname, "storage", folder))) {
        fs.mkdirSync(path.join(__dirname, "storage", folder));
    }
}

// global variables
global.BASE_PATH = __dirname;
global.isset = (cb) => {
    try {
        return cb();
    } catch {
        return undefined;
    }
}

// middlewares
app.use(bodyParser.json({ limit: "1024mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((request, response, next) => {
    console.log("->", request.method, request.url);
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", '*');
    response.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges');
    next();
});

require('./config/database');
const apiRoutes = require("./routes/api");
const Watch = require('./controllers/Watch');
const Auth = require("./middleware/Auth");

app.use("/api", apiRoutes);
app.get('/watch/:id', Auth, Watch.watchVideo);
app.get('/thumbnails/:name', Watch.images);
app.get('/banners/:name', Watch.images);
app.get('/images/:name', Watch.images);

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Server Runing On ${PORT}`));
