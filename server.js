const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');
const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");
const cors = require("cors");
const path = require("path");
const port = 8000;
const fs = require('fs')

const app = express();



app.use(cors());
app.use(express.static(path.join(__dirname + '/public/dist')));
app.use(busboy());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(busboyBodyParser());

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'sad9#cdSsjdi-Ajion38*3lL-43*sdfs',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

require('./server/config/mongoose');
require('./server/config/routes')(app);

const server = http.createServer(app);

app.listen(port, () => console.log(`listening in port ${port}...`));
