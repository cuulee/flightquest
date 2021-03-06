//onetime process to convert the DAT to a JSON object

const fs = require('fs')

const airportsDataSource = fs.readFileSync('data/airports.dat', 'utf-8')
const airportTextStrings = airportsDataSource.split('\n')

const airportCodeArray = []
const airportDataArray = []

processStrings()

function  processStrings(){

  for (var i = 0; i <= airportTextStrings.length; i++) {

    if (i == airportTextStrings.length) {
      saveFile(airportDataArray)
    }

    else {
      var item = airportTextStrings[i].split(',')
      var itemDeStringed = []
      var singleAirportJSON = {}

      for (var j = 0; j < item.length; j++) {
        if (j >= 6 && j <= 8) {
          itemDeStringed.push(item[j])
        }
        else {
          var updated = item[j].substring(1,item[j].length-1)
          itemDeStringed.push(updated)
        }
      }

      airportCodeArray.push(itemDeStringed[4])
      singleAirportJSON.AirportID = itemDeStringed[0]
      singleAirportJSON.Name = itemDeStringed[1]
      singleAirportJSON.City = itemDeStringed[2]
      singleAirportJSON.Country = itemDeStringed[3]
      singleAirportJSON.ICAO = itemDeStringed[5]
      singleAirportJSON.Latitude = Number(itemDeStringed[6])
      singleAirportJSON.Longitude = Number(itemDeStringed[7])
      singleAirportJSON.Altitude = Number(itemDeStringed[8])
      singleAirportJSON.Timezone = itemDeStringed[9]
      singleAirportJSON.DST = itemDeStringed[10]
      singleAirportJSON.TZ = itemDeStringed[11]
      singleAirportJSON.Type = itemDeStringed[12]
      singleAirportJSON.Source = itemDeStringed[13]

      airportDataArray.push(singleAirportJSON)
    }
  }
}

function saveFile(airportDataArray){
  fs.writeFile('data/airportCodes.json', JSON.stringify(airportCodeArray), 'utf-8', function(){console.log('codes written');})
  fs.writeFile('data/airportData.json', JSON.stringify(airportDataArray), 'utf-8', function(){console.log('data written');})
}
