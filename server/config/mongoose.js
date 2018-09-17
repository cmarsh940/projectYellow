const mongoose = require('mongoose');
const fs = require('fs');
var path = require('path');
let models_path = __dirname + '/../models';

mongoose.connect('mongodb://localhost:27017/MESurveys', { useNewUrlParser: true }).then((res) => {
        console.log("Success!!")
    }).catch((e) => { 
        console.log("error is: " + e); 
    });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

fs.readdirSync(models_path).forEach((file) => {
    if (file.includes('.js')) {
        console.log(`loading ${file}...`)
        require(`${models_path}/${file}`);
    }
});