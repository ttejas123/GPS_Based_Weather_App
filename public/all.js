getdata();
		async function getdata(){
			const response = await fetch('/api'); //fetch data from route(/api) and put that data in response
			const data = await response.json();   //now convert response data into json format

			const mymap = L.map('issMap').setView([0,0],1);
			const attribution= 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
			const tilesUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			const tiles = L.tileLayer(tilesUrl,{attribution});
		    tiles.addTo(mymap);
		    for(item of data){
		       
		    	const marker = L.marker([item.lat, item.lon]).addTo(mymap);

                const city = item.weather_cityname;
                const co = item.airquality.measurements[1].value;
                const so2= item.airquality.measurements[2].value;
                const msg= item.weather.weather[0].description;
                const temp = Math.round(item.weather.main.temp - 273);
		    	
		    	const txt = `${city}<br><h2>${temp}&deg C</h2><h4>${msg}<br><br>Pollution:<br>so2:${so2}µg/m³<br>co:${co}µg/m³<h4>
		    				 `;
                
                marker.bindPopup(txt);

		    }
		    console.log(data);              //console,log in client side
		}