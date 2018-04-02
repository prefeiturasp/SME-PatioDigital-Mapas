var mapsBuilder = {

};

mapsBuilder.createMap = function () {
  var map = L.map('map').setView([-23.550461, -46.633206], 10);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  	maxZoom: 18,
  	attribution: 'Dados do mapa &copy; contribuidores <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
  		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  		'Imagens © <a href="http://mapbox.com">Mapbox</a>',
  	id: 'mapbox.light'
  }).addTo(map);

  return map;
}

mapsBuilder.createChoropleth = function (configs) {
  var map = mapsBuilder.createMap();

  // control that shows state info on hover
  var info = L.control();

  info.onAdd = function (map) {
  	this._div = L.DomUtil.create('div', 'info');
  	this.update();
  	return this._div;
  };

  info.update = function (props) {
  	this._div.innerHTML = '<h4>' + configs.featureNameLabel + '</h4>' +  (props ?
  		'<b>' + props[configs.featureNameProp] + '</b><br />' + props[configs.featureValueProp] + ' ' + configs.featureValueLabel
  		: 'Passe o mouse sobre o mapa para ver detalhes');
  };

  info.addTo(map);

  $.getJSON('data.geojson', function(data) {
  	function highlightFeature(e) {
  		var layer = e.target;

  		layer.setStyle({
  			weight: 5,
  			color: '#666',
  			dashArray: '',
  			fillOpacity: 0.7
  		});

  		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
  			layer.bringToFront();
  		}

  		info.update(layer.feature.properties);
  	}

  	var geojson;

  	function resetHighlight(e) {
  		geojson.resetStyle(e.target);
  		info.update();
  	}

  	function zoomToFeature(e) {
  		map.fitBounds(e.target.getBounds());
  	}

  	function onEachFeature(feature, layer) {
  		layer.on({
  			mouseover: highlightFeature,
  			mouseout: resetHighlight,
  			click: zoomToFeature
  		});
  	}

  	// generate color breaks
  	var series = [];
  	for (var i = 0; i < data.features.length; i++) {
  		series.push(data.features[i].properties[configs.featureValueProp]);
  	}
  	var brew = new classyBrew();
  	brew.setSeries(series);
  	brew.setNumClasses(configs.brewNumClasses);
  	brew.setColorCode(configs.brewColorRamp);
  	brew.classify();

  	function getColor(number) {
    	return brew.getColorInRange(number);
  	}

  	function style(feature) {
  		return {
  			weight: 2,
  			opacity: 1,
  			color: 'white',
  			dashArray: '3',
  			fillOpacity: 0.7,
  			fillColor: getColor(feature.properties[configs.featureValueProp])
  		};
  	}

    var geojson = L.geoJson(data, {
  		style: style,
  		onEachFeature: onEachFeature
    });
    geojson.addTo(map);
  	map.fitBounds(geojson.getBounds());
  	map.attributionControl.addAttribution(configs.dataSourceMsg);


  	var legend = L.control({position: 'bottomright'});

  	legend.onAdd = function (map) {

  		var div = L.DomUtil.create('div', 'info legend'),
  		grades = brew.getBreaks(),
  		labels = [],
  		from, to;

  		for (var i = 0; i < grades.length - 1; i++) {
  			from = grades[i];
  			to = grades[i + 1];

  			labels.push(
  				'<i style="background:' + getColor(from + 1) + '"></i> ' +
  				from + (to ? configs.featureValueUnit + ' &ndash; ' + to + configs.featureValueUnit : '+'));
  			}

  			div.innerHTML = '<h4>' + configs.legendTitle + '</h4>';
  			div.innerHTML += labels.join('<br>');
  			return div;
  		};

  		legend.addTo(map);
  });
}
