console.log("algolia script");
// facetFilters: ''

var markers = [];
var markerClusters;
var markersIcons = {};

var svgIcons = {
	'0': '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 21 30"><g fill="none" fill-rule="evenodd"><path stroke="white" stroke-with="10" fill="{color1}" d="M0 10.26c0 5.352 4.522 12.254 7.54 15.616 1.13 1.254 2.445 2.944 2.445 2.944s1.41-1.7 2.623-2.99c3.016-3.222 7.363-9.69 7.363-15.57C19.97 4.59 15.5 0 9.988 0 4.47 0 0 4.592 0 10.26z"/><path fill="#FFF" d="M9.986 14.856c-2.49 0-4.512-2.076-4.512-4.634 0-2.562 2.02-4.636 4.512-4.636 2.49 0 4.512 2.076 4.512 4.636 0 2.558-2.022 4.634-4.512 4.634"/></g></svg>',
	'1': '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 165 165"><circle cx="83" cy="83" r="80" fill="{color1}" stroke="#FFF" stroke-width="5"/><text fill="#FFF" font-family="Open Sans" font-size="80" font-weight="bold"><tspan x="83" y="108" text-anchor="middle">{number1}</tspan></text></svg>'
	,'2': '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 165 165"><circle cx="51" cy="52" r="49" fill="{color1}" stroke="#FFF" stroke-width="5"/><text fill="#FFF" font-family="Open Sans" font-size="50" font-weight="bold"><tspan x="51" y="66" text-anchor="middle">{number1}</tspan></text><circle cx="113" cy="113" r="49" fill="{color2}" stroke="#FFF" stroke-width="5"/><text fill="#FFF" font-family="Open Sans" font-size="50" font-weight="bold"><tspan x="113" y="132" text-anchor="middle">{number2}</tspan></text></svg>'
	,'3': '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 165 165"><circle cx="44.5" cy="50.5" r="41.5" fill="{color1}" stroke="#FFF" stroke-width="5"/><circle cx="121.5" cy="50.5" r="41.5" fill="{color2}" stroke="#FFF" stroke-width="5"/><circle cx="80.5" cy="114.5" r="41.5" fill="{color3}" stroke="#FFF" stroke-width="5"/><text fill="#FFF" font-family="Open Sans" font-size="45" font-weight="bold"><tspan text-anchor="middle" x="44" y="66">{number1}</tspan></text><text fill="#FFF" font-family="Open Sans" font-size="45" font-weight="bold"><tspan text-anchor="middle" x="121" y="66">{number2}</tspan></text><text fill="#FFF" font-family="Open Sans" font-size="45" font-weight="bold"><tspan text-anchor="middle" x="80" y="130">{number3}</tspan></text></svg>'
	,'4': '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 165 165"><circle cx="44.5" cy="49.5" r="41.5" fill="{color1}" stroke="#FFF" stroke-width="5"/><circle cx="121.5" cy="49.5" r="41.5" fill="{color2}" stroke="#FFF" stroke-width="5"/><circle cx="121.5" cy="116.5" r="41.5" fill="{color3}" stroke="#FFF" stroke-width="5"/><circle cx="44.5" cy="116.5" r="41.5" fill="{color4}" stroke="#FFF" stroke-width="5"/><text fill="#FFF" font-family="Open Sans" font-size="45" font-weight="bold"><tspan x="41" y="63" text-anchor="middle">{number1}</tspan></text><text fill="#FFF" font-family="Open Sans" font-size="45" font-weight="bold"><tspan x="121" y="63" text-anchor="middle">{number2}</tspan></text><text fill="#FFF" font-family="Open Sans" font-size="45" font-weight="bold"><tspan x="41" y="130" text-anchor="middle">{number3}</tspan></text><text fill="#FFF" font-family="Open Sans" font-size="45" font-weight="bold"><tspan x="121" y="130" text-anchor="middle">{number4}</tspan></text></svg>'
};

var colors = ['#004A5D', '#F16732', '#CBB451', '#ED1C39'];


function searchCallback(err, content) {
	if (markerClusters) {
		markerClusters.clearLayers();
	}
	markers = [];
	markerClusters = new L.markerClusterGroup({
		iconCreateFunction: function(cluster) {
			brands = {};

			var markers = cluster.getAllChildMarkers();
			markers.forEach(function(marker) {
				if (!brands[marker.options.brand]) {
					brands[marker.options.brand] = 0;
				}
				brands[marker.options.brand]++;
			});

			var icon = svgIcons[Object.keys(brands).length];

			Object.keys(brands).forEach(function(brand, index) {
				icon = icon.replace('{color'+(index+1)+'}', colors[index]).replace('{number'+(index+1)+'}', brands[brand]);
			});

			return new L.DivIcon({
				iconSize: [60, 60],
				html: icon
			});
		}
	});

	content.results.forEach(function(query) {
		query.hits.forEach(function(item) {
			var marker = L.marker(
				[item._geoloc.lat, item._geoloc.lng],
				{icon: markersIcons[item.brand], brand: item.brandID}
			).bindPopup('<strong>'+item.brand+'</strong><br />'+(item.name || '')+'<br />'+item.address);
			markerClusters.addLayer(marker);
			markers.push(marker);
		});
	});
	map.fitBounds(markerClusters.getBounds());
	map.addLayer(markerClusters);
};

var algolia = new algoliasearch('HLQE7ESGUW', '7df023816c1b3b1002194f120524c563');
algolia.search([{indexName: 'stores', query: '', params: {facets: "brand", hitsPerPage: 0}}], function(err, content) {
	Object.keys(content.results[0].facets.brand).forEach(function(brand) {
		$('<li><label><input type="checkbox" /> <span></span></label></li>').appendTo('.liste-brands').attr('data-name', brand).find('span').text(brand);
	});

	searchMarkers();
});

function searchMarkers() {
	var brands = [];

	$('.liste-brands li').css('color', 'black');
	$('.liste-brands li input:checked').parent().parent().each(function(index, element) {
		$element = $(element);

		if (index >= 4) {
			return false;
		}

		$element.css('color', colors[index]);

		var brand = $element.attr('data-name');

		markersIcons[brand] = new L.DivIcon({
			iconSize: [40, 40],
			html: svgIcons['0'].replace('{color1}', colors[index--])
		});

		brands.push({indexName: 'stores', query: $('.searchField').val(), params: {facetFilters: 'brand:'+brand, hitsPerPage: 1000, attributesToRetrieve: '_geoloc,brandID,brand,name,address', attributesToHighlight: 'none'}});
	});
	if (brands.length > 0) {
		algolia.search(brands, searchCallback);
	} else {
		markerClusters.clearLayers();
	}
}

$(document).on('click', 'input[type="checkbox"]', searchMarkers);
$(document).on('input', '.searchField', searchMarkers);



//$(document).on('click', '.search', );