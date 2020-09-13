function setup(){
		
		let lat, lon, airquality, weather, weather_cityname;
		
		    const button = document.getElementById('sub');
		    button.addEventListener('click', async event =>{
                //for weather 
                const apiUrl = `weather/${lat},${lon}`;
                //const apiUrl = `/weather`;
                const fetchRes = await fetch(apiUrl);
                const fetch_json = await fetchRes.json();
                airquality = fetch_json.aq_json.results[0];
                weather = fetch_json.w_json.list[0];
                weather_cityname = fetch_json.w_json.city.name;
                try{
                    document.getElementById("locName").innerHTML =  weather_cityname;
                    document.getElementById("co_index").innerHTML = airquality.measurements[1].value;
                    document.getElementById("so2_index").innerHTML = airquality.measurements[2].value;

                }catch(err){
                    airquality = {
                                  measurements:[{value:"NO measurements"},{value:"NO measurements"},{value:"NO measurements"}]
                                 };
                    document.getElementById("locName").innerHTML = weather_cityname;
                    document.getElementById("co_index").innerHTML = airquality.measurements[1].value;
                    document.getElementById("so2_index").innerHTML = airquality.measurements[2].value;
                }

                document.getElementById("locMsg").innerHTML = weather.weather[0].description;
                document.getElementById("locTemp").innerHTML = Math.round(weather.main.temp - 273);
                
                console.log(fetch_json);
//insert data into database
                const data = { lat, lon, weather, airquality, weather_cityname};
				const option = {
                	method:'POST',
                	headers:{
                		'Content-Type':'application/json'
                	},
                	body:JSON.stringify(data)
                };
                const res = await fetch('/api',option);
                const json = await res.json();
                console.log(json); //data collected from option via map

                //mymap and marker

                let firstTime = true;//zomm intervel problem
                
                const marker = L.marker([lat, lon]).addTo(mymap);//This is only for marker
                const txt = `${weather_cityname}<br><h2>${Math.round(weather.main.temp - 273)}&deg C</h2><h4>${weather.weather[0].description}<br><br>Pollution:<br>so2:${airquality.measurements[2].value}µg/m³<br>co:${airquality.measurements[1].value}µg/m³<h4>`;
                marker.bindPopup(txt); //bind txt content to marker

            	if(firstTime){  //to make marker center of map
               		mymap.setView([lat, lon], 2); //this is for map
               		firstTime = false;   
            	}

		});
		//navigation
        if ('geolocation' in navigator) {
            console.log("geolocation is available");
                navigator.geolocation.getCurrentPosition(position => {
                        
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                document.getElementById('latitude').textContent = lat;
                document.getElementById('longitude').textContent = lon;
                console.log(lat, lon);
   
            });
        }else{
            console.log("geolocation is not available");
        }

		//map and marker
		const mymap = L.map('issMap').setView([0,0],1);
		const attribution= 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
		const tilesUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		const tiles = L.tileLayer(tilesUrl,{attribution});
		tiles.addTo(mymap);


		noCanvas();
		
	}	