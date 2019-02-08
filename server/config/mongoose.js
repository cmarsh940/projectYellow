const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const uri = require('./config').uri;

let models_path = __dirname + '/../models';


mongoose.connect(uri, { useNewUrlParser: true, autoIndex: false });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to DB");
});


fs.readdirSync(models_path).forEach((file) => {
    if (file.includes('.js')) {
        console.log(`loading ${file}...`)
        require(`${models_path}/${file}`);
    }
});