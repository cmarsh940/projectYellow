const bodyParser = require('body-parser');
const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");
const config = require("./server/config/config");
const compression = require('compression');
const cors = require("cors");
const csrf = require('csurf')
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const morgan = require('morgan');
const path = require("path");
const port = normalizePort(process.env.PORT || '8000');
const session = require('express-session');

const csp = `default-src * data: blob:;script-src *.braintree-api.com *.braintreegateway.com *.facebook.com  *.facebook.net *.google-analytics.com *.google.com *.linkedin.com 127.0.0.1:*  'unsafe-inline' 'unsafe-eval' blob: data: 'self';style-src data: blob: 'unsafe-inline' *;connect-src *.braintree-api.com *.braintreegateway.com localhost:* *.facebook.com facebook.com *.fbcdn.net *.facebook.net *.google.com *.googleapis.com`;

const app = express();

app.use(helmet());

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:* always');
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('X-Content-Type-Options', 'nosniff');
//     res.header('X-Frame-Options', 'DENY');
//     res.header('Referrer-Policy', 'no-referrer-when-downgrade');
//     res.header('Content-Security-Policy', csp);
//     res.header('Strict-Transport-Security', 'max-age=7889238; includeSubDomains; preload');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header('Access-Control-Expose-Headers', 'Content-Length');
//     res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range, X-XSRF-TOKEN');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200); 
//     } else { 
//         return next(); 
//     }      
// });


app.use(compression()); //Compress all routes
app.use(cors());
// app.use(express.static(path.join(__dirname + '/public/dist')));
app.use(busboy());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(busboyBodyParser());

// setup the logger
app.use(morgan('dev'));

// app.set('trust proxy', true) // trust first proxy

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

require('./server/config/mongoose');
require('./server/config/routes')(app);

app.use(csrf());
app.use(function (req, res, next) {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return next();
});


const server = http.createServer(app);

const apiRouter = express.Router();

app.use('/api', apiRouter);

apiRouter.get('/', (req, res) => {
    res.json({ name: 'Surveys by ME', date: Date.now(), version: 1.5 });
});

app.listen(port, () => console.log(`listening in port ${port}...`));

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






