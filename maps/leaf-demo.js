L.mapbox.accessToken = 'pk.eyJ1IjoiemxpdHVzIiwiYSI6ImNpZmkzN3p1MTAwdWl0bmx5cnRiNXgwMnYifQ.yfdMEygAPhLrsdCcTHeI0g';

// var map = L.mapbox.map('map', 'zlitus.f0a5d596');

//L.mapbox.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
	//attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
//	subdomains: ['otile1','otile2','otile3','otile4']
//}).addTo( map );

var myURL = jQuery( 'script[src$="leaf-demo.js"]' ).attr( 'src' ).replace( 'leaf-demo.js', '' );



  var map = L.mapbox.map('map', null, {
      maxZoom: 18
  }).setView([22.76, -25.84], 3);

var tileLayer;

$('input[data-map]').click(function() {
	if (tileLayer) { map.removeLayer(tileLayer); }
	tileLayer = L.mapbox.tileLayer($(this).attr('data-map')).addTo(map);
});

tileLayer = L.mapbox.tileLayer('mapbox.pirates').addTo(map);



// function setTileLayer(type) {
// 	if (type =='streets') {
// 	 	mapbox.tileLayer('mapbox.streets')
// 	} 
// }

  // layers.Streets.addTo(map);

  // L.control.layers(layers).addTo(map);