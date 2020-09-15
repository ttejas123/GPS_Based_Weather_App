const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const path = require('path');
const pathToData = path.resolve(__dirname, "db/database")
const database = new Datastore({ filename: pathToData});
database.loadDatabase();
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`listening port ${port}`)
});
app.use(express.static('public'));  //host client side
app.use(express.json({limit:'1mb'}));





app.get('/api', (req,res)=>{
	database.find({},(err, data) => {
        if(err){
        	res.end();
        	return;
        }
    	res.json(data);
	});
});

app.post('/api',(req,res) =>{
	const timestamp = Date.now();
	console.log('I got Request!');
	const data = req.body;  //data variable is now taking all values of body
	data.timestamp = timestamp;  //we are attaching timestamp to data via this type "data.timestamp"
	//database.insert(data);this data is sent to the database whcich we create
    database.insert(data, (err, docs)=>{
    	if(err){
    		return err;
    	}
    	//this data is get send back to client console	
	    res.json(data);

    });
});


app.get('/weather/:latlon',async (req,res) =>{
    console.log(req.params);
    const latlon = req.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat,lon);
    const api_key = process.env.api_key;
    //weather info
    //const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=67e2437371e88b66a84fff4afcc8b02d&lat=19.1511&lon=72.9906&zoom=5`;
    const weather_Url = `http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=${api_key}&lat=${lat}&lon=${lon}&zoom=5`;
  
    const fetchRes_weather = await fetch(weather_Url);
    const w_json = await fetchRes_weather.json();
    //air quality info
    //https://api.openaq.org/v1/latest?coordinates=19.151052,72.990646
    const aq_Url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;

    const fetchRes_aq = await fetch(aq_Url);
    const aq_json = await fetchRes_aq.json();
    const s_data = {
        w_json,
        aq_json
    }
    res.json(s_data);
});