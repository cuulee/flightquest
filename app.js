const fs = require('fs')

var airports = ['BTV', 'ATL']

const airportCodes = JSON.parse(fs.readFileSync('data/airportCodes.json', 'utf-8'))
const airportData = JSON.parse(fs.readFileSync('data/airportData.json', 'utf-8'))

getAirportCoords();

function getAirportCoords() {
  var allCoords = []
  for (var i = 0; i <= airports.length; i++) {
    if (i != airports.length) {
      var codeIndex = airportCodes.indexOf(airports[i])
      if (codeIndex > 0) {
        allCoords.push(airportData[codeIndex].Longitude)
        allCoords.push(airportData[codeIndex].Latitude)
      }
    } else {
      setbbox(allCoords)
    }
  }
}

function setbbox(allCoords) {
  console.log(allCoords);
}
