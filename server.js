const bodyParser = require('body-parser');
const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");
const cors = require("cors");
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const http = require('http');
const morgan = require('morgan');
const path = require("path");
const port = 8000;
const session = require('express-session');


const app = express();


app.use(helmet());
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

app.set('trust proxy', true) // trust first proxy

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
