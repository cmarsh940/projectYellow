const mongoose = require('mongoose');
const fs = require('fs');
var path = require('path');
let models_path = __dirname + '/../models';

mongoose.connect('mongodb://localhost/MESurvey');

mongoose.Promise = global.Promise;

fs.readdirSync(models_path).forEach((file) => {
    if (file.includes('.js')) {
        console.log(`loading ${file}...`)
        require(`${models_path}/${file}`);
    }
});