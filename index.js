const express = require('express');
const axios = require('axios');
const app = express();
const path = require ('path');

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));

const private_app_token = ''

app.get('/homepage-establishments', async (req, res) => {
    const establishmentsEndpoint = 'https://api.hubspot.com/crm/v3/objects/establishments?properties=name,address,contact_person,email_address,establishment_type';
    const headers = {
      Authorization: `Bearer ${private_app_token}`,
      'Content-Type': 'application/json'
    }
    const params = {
      properties: ['name', 'address', 'contact_person' , 'email_address' , 'establishment_type']
    }
    try {
      const response = await axios.get(establishmentsEndpoint, { headers, params });
      console.log('API Response:', JSON.stringify(response.data, null, 2));
      const establishments = response.data.results;
      console.log('Establishment data:', JSON.stringify(establishments, null, 2));
      res.render('homepage', { establishments: establishments });
    } catch (error) {
      console.error(error);
    }
  })
  
  app.get('/update-establishments', (req, res) => {
    try {
      res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' }); 
    } catch (error) {
      console.error(error);
    }
  });
  
  
  app.post('/update-establishments', async (req, res) => {
    const establishmentsEndpoint = 'https://api.hubspot.com/crm/v3/objects/establishments';
    const headers = {
      Authorization: `Bearer ${private_app_token}`,
      'Content-Type': 'application/json'
    }
    const data = {
      properties: {
        name: req.body.name,
        address: req.body.address,
        contact_person: req.body.contact_person,
        email_address: req.body.email_address,
        establishment_type: req.body.establishment_type
      }
    }
    try {
      const response = await axios.post(establishmentsEndpoint, data, { headers });
      console.log('API Response:', JSON.stringify(response.data, null, 2));
      res.redirect('/homepage-establishments');
    } catch (error) {
      console.error(error);
    }
  });


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));