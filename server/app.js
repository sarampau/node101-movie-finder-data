const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config({path: __dirname + '/.env'});
const apikey = process.env.API_KEY;

const app = express();
const cache = {};

app.use(morgan('dev'));

app.get('/', (req, res) => {
    if (cache[req.url]) {
        return res.json(cache[req.url].data);
    }
    return axios.get('http://www.omdbapi.com' + req.url + '&apikey=' + apikey)
        .then(response => {
            cache[req.url] = {
                timestamp: Date.now(),
                data: response.data
            };
        return res.json(response.data);
    })
    .catch(error => {
        console.log(error);
        return res.json('error')
    });
});

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

module.exports = app;