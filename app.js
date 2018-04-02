const fs = require('fs')
const turf = require('turf')
const mapboxgl = require('mapbox-gl')
const restclient = require('restler');

const apiKeyFile = require('./keys.js')
const airportCodes = JSON.parse(fs.readFileSync('data/airportCodes.json', 'utf-8'))
const airportData = JSON.parse(fs.readFileSync('data/airportData.json', 'utf-8'))

const airports = []

mapboxgl.accessToken = "pk.eyJ1IjoidGhlbWFwc21pdGgiLCJhIjoiYTdmMDdiZjYxNzNmNzFiOGVjZDJiYzI5MGQ5N2VlMmQifQ.fUnAp-76Ka0d3v4oMNPhFw";
const map = new mapboxgl.Map({
  container: "map", // container id
  style: "mapbox://styles/mapbox/dark-v9", // stylesheet location
  center: [-74.50, 40], // starting position [lng, lat]
  zoom: 2 // starting zoom
});

// page init
init()

function init () {
  document.getElementById('submit').addEventListener('click', function() {parseAirportCodes ()})
}

function  parseAirportCodes (origin, dest, callback) {
  var origin = document.getElementById('origin').value
  var dest = document.getElementById('dest').value

  airports.push(origin)
  airports.push(dest)
  getAirportCoords(airports)
}

function getAirportCoords(airports) {
  var allCoords = []
  for (var i = 0; i <= airports.length; i++) {
    if (i != airports.length) {
      var codeIndex = airportCodes.indexOf(airports[i])
      if (codeIndex > 0) {
        var lnglat = []
        lnglat.push(airportData[codeIndex].Longitude)
        lnglat.push(airportData[codeIndex].Latitude)
        allCoords.push(lnglat)
      }
    } else {
      return makePathFeature(allCoords)
    }
  }
}

function makePathFeature(allCoords) {
  var line = turf.lineString(allCoords)
  var lineFeature = {}
  lineFeature.id = airports[0] + ' to ' + airports[1]
  lineFeature.type = 'line'
  lineFeature.source = {}
  lineFeature.source.type = "geojson"
  lineFeature.properties = {}
  lineFeature.source.data = line
  lineFeature.layout = {}
  lineFeature.layout['line-join'] = 'round'
  lineFeature.layout['line-cap'] = 'round'
  lineFeature.paint = {}
  lineFeature.paint['line-color'] = '#ffdd00'
  lineFeature.paint['line-width'] = 9

  map.fitBounds(turf.bbox(line), {padding: 70})
  map.addLayer(lineFeature)
}

function fetchRoute() {
  console.log('fetching!');

  var fxml_url = 'http://flightxml.flightaware.com/json/FlightXML2/';
  var username = 'themapsmith';
  var apiKey = apiKeyFile.apiKey;


  restclient.get(fxml_url + 'MetarEx', {
    username: username,
    password: apiKey,
    query: {
      airport: 'KAUS',
      howMany: 1
    }
  }).on('success', function(result, response) {
    // util.puts(util.inspect(result, true, null));
    var entry = result.MetarExResult.metar[0];
    console.log('The temperature at ' + entry.airport + ' is ' + entry.temp_air + 'C');
  });

  restclient.get(fxml_url + 'Enroute', {
    username: username,
    password: apiKey,
    query: {
      airport: 'KIAH',
      howMany: 10,
      filter: '',
      offset: 0
    }
  }).on('success', function(result, response) {
    console.log('Aircraft en route to KIAH:');
    //util.puts(util.inspect(result, true, null));
    var flights = result.EnrouteResult.enroute;
    for (i in flights) {
      var flight = flights[i];
      //util.puts(util.inspect(flight));
      console.log(flight.ident + ' (' + flight.aircrafttype + ')\t' +
        flight.originName + ' (' + flight.origin + ')');
    }
  });




}
