const mongoose = require('mongoose');
const fs = require('fs');
var path = require('path');
let models_path = __dirname + '/../models';
const uri = require('./config').uri;
const options = require('./config').options;

mongoose.connect(uri, { useNewUrlParser: true }).then((res) => {
        console.log("Success!!", res);
    }).catch((e) => {
    console.log("error is: " + e);
});

fs.readdirSync(models_path).forEach((file) => {
    if (file.includes('.js')) {
        console.log(`loading ${file}...`)
        require(`${models_path}/${file}`);
    }
});