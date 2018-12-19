const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const uri = require('./config').uri;

let models_path = __dirname + '/../models';


mongoose.set('useNewUrlParser',true);
mongoose.set('useCreateIndex',true);
mongoose.connect(uri)
.then(connection => {
  console.log('Connected to MongoDB')
})
.catch(error => {
console.log(error.message)
})


fs.readdirSync(models_path).forEach((file) => {
    if (file.includes('.js')) {
        console.log(`loading ${file}...`)
        require(`${models_path}/${file}`);
    }
});