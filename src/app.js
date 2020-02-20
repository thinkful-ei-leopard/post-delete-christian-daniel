require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet=require('helmet');
const { NODE_ENV } = require('./config');
const uuid = require('uuid/v4');

const app= express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.post('*', function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  console.log(apiToken);
  console.log('validate bearer token middleware')
  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({error: 'Unauthorized request'})
  }
  next()
})

app.delete('*', function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  console.log('validate bearer token middleware')
  if(!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({error: 'Unauthorized request'})
  }
    next()
})

const addressBook = [
  {
    id: '5454',
    firstName: 'Jim',
    lastName: 'Smith',
    address1: 'asdfas',
    city: 'asdf',
    state: 'ny',
    zip: 65454
  }
];

app.post('/address', (req, res) => {
  const {firstName, lastName, address1, address2, city, state, zip = false} = req.query;
  if(!firstName) {
    return res
      .status(400)
      .send('First Name required')
  }
  if(!lastName) {
    return res
    .status(400)
    .send("Last Name required")
  }
  if(!address1) {
    return res
      .status(400)
      .send('Address line 1 required')
  }
  if(!city) {
    return res
      .status(400)
      .send('City required')
  }
  if(!state) {
    return res
      .status(400)
      .send('State required')
  }
  if(!zip) {
    return res
      .status(400)
      .send('Zip code required')
  }
  if(state && state.length != 2) {
    return res
      .status(400)
      .send('State must be 2 character state code')
  }
  if(zip && zip.length != 5) {
    return res
      .status(400)
      .send('Zip code must be exactly five digits')
  }
  else {
    const id = uuid();
    const newAddress = {
      id,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zip,
    };
    addressBook.push(newAddress);
    res.send("All validation passed");
  }
});
app.delete("/address/:id", (req, res) => {
  const addressId  = req.params.id;
  console.log(addressBook);
  const index = addressBook.findIndex(address => address.id === addressId);
  console.log(index);
  console.log(addressId);
  if(index === -1) {
    return res
      .status(404)
      .send('Address not found');
  }
  addressBook.splice(index, 1);

  res.send('Deleted');
});

app.get('/address', (req, res) => {
     return res
        .status(200)
        .json(addressBook)
});

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
     })

module.exports = app;