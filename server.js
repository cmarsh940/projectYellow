const bodyParser = require('body-parser');
const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");
const config = require("./server/config/config");
const cors = require("cors");
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const http = require('http');
const morgan = require('morgan');
const path = require("path");
const port = normalizePort(process.env.PORT || '8000');
const session = require('express-session');

const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DEconstE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

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
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

require('./server/config/mongoose');
require('./server/config/routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
});

const cpuCount = require('os').cpus().length;
console.log('CPU nodes = ' + cpuCount);

app.set('port', port);
const server = http.createServer(app);

server.listen(port, () => console.log(`listening in port ${port}...`));

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}






