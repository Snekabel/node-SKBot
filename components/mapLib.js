const fs = require('fs');
const parser = require('xml2json');
import * as turf from '@turf/turf'

/*
  Returns distance between to GPS pos on Earth in meters
*/
exports.distanceBetweenPoints = function(pos1, pos2) {
  const R = 6371; // km (change this constant to get miles)
	var dLat = (pos2.lat-pos1.lat) * Math.PI / 180;
	var dLon = (pos2.lon-pos1.lon) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(pos1.lat * Math.PI / 180 ) * Math.cos(pos2.lat * Math.PI / 180 ) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return Math.round(d*1000);
	return d;
}

/*
  Returns speed in m/s for travel between points and timestamps
*/
exports.speedBetweenPoints = function(pos1, pos2) {
  let speed = 0;
  let distance = exports.distanceBetweenPoints(pos1, pos2);
  let time1 = new Date(pos1.time);
  let time2 = new Date(pos2.time);
  let timeDif = Math.abs(time2 - time1)/1000;

  speed = distance / timeDif; // Speed in Meters per Second
  speed = speed * 3.6;

  //console.log("Distance: ", distance, " Time1: ",time1, " Time2: ",time2, " TimeDif: ",timeDif, " Speed: ",speed);
  return speed;
}

/*
  Returns hight-difference in meter between 2 GPS points
*/
exports.heightDifferenceBetweenPoints = function(pos1, pos2) {
  if(pos1.ele && pos2.ele) {
    return pos1.ele - pos2.ele;
  }
  return;
}

/*
  Returns distance in meter traveled from an array of GPS points
*/
exports.distanceTraveledFromPoints = function(points) {
  let distance = 0;
  for(let i = 0; i < points.length; i++) {
    if(i < points.length-1) {
      distance += exports.distanceBetweenPoints(points[i], points[i+1]);
    }
  }
  return distance;
}

/*
  Returns average speed in m/s from an array of points
  Expects array of points with included timestamp
*/
exports.averageSpeedFromPoints = function(points) {
  let speed = 0;
  for(let i = 0; i < points.length; i++) {
    if(i < points.length-1) {
      speed += exports.speedBetweenPoints(points[i], points[i+1]);
    }
  }
  speed = speed / points.length;
  return speed;
}

/*
  Returns average height difference from a list of GPS points
*/
exports.averageHightDifferentFromPoints = function(points) {
  let height = 0;
  for(let i = 0; i < points.length; i++) {
    if(i < points.length-1) {
      height += exports.heightDifferenceBetweenPoints(points[i], points[i+1]);
    }
  }
  height = height / points.length;
  return height;
}

/*
  Converts a miles per hour speed to kilometers per hour
*/
exports.mphToKmh = function(speed) {
  return speed * 1.60934;
}

/*
  Converts a kilometers per hour speed to miles per hour
*/
exports.kmhToMph = function(speed) {
  return speed * 0.621371;
}

/*
  Returns Leaflet Map
*/
exports.leaflet = function(res, token, gpx) {
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.write("<head>");
   res.write('<link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA==" crossorigin=""/>');
   res.write('<script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg==" crossorigin=""></script>');
   res.write("</head>");
   res.write("<body style=\"margin: 0\"");
   res.write('<div id="mapid" style="height: 100vh; width: 100vw;"></div>');
   res.write('<script type="text/javascript">');
   res.write('var mymap = L.map(\'mapid\').setView([59.329751, 18.067218], 13); ');
   res.write('L.tileLayer(\'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}\', { \n'+
   'attribution: \'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>\', \n'+
   'maxZoom: 18,  \n'+
   'id: \'mapbox.streets\', \n'+
   'accessToken: \'pk.eyJ1IjoidGJ0aGVncjgxIiwiYSI6ImNqdG80YTFnNzA1cHg0OXF0ZW81eDBtemkifQ.zdnYP1ufAPburgumLeECFw\' \n'+
   '}).addTo(mymap);')

   if(gpx) {
     // Load GPX
     console.log("Load GPX");
     fs.readFile('gpx/'+gpx, 'utf8', function(err, contents) {
       if (err) {
         error.log(err);
         res.write("Error");
       }
       else {
         console.log("No error, parse GPX");
         var data = JSON.parse(parser.toJson(contents));

         let trip = data.gpx.trk.trkseg.trkpt;
         console.log("Trip Length: ",trip.length);
         var latlng = [];
         var points = [];
         const checkpoint = [{lat: 59.375351, lon: 17.881304},{lat: 59.375235, lon: 17.880486}]
         //const checkpoint = [{lat: 59.317533, lon: 17.856187}, {lat:59.407714, lon: 18.048356}];
         for(let part in trip) {
           if(trip.hasOwnProperty(part)) {
             latlng.push([trip[part].lat,trip[part].lon]);
             points.push(trip[part]);
             //console.log(trip[part].lat, trip[part].lon);
             if(part > 0 && part+1 < trip.length){
              var results = exports.checkCheckpoint(checkpoint[0], checkpoint[1], {lat: parseFloat(trip[part].lat), lon: parseFloat(trip[part].lon)}, {lat: parseFloat(trip[part+1].lat), lon:parseFloat(trip[part+1].lon)});
              if(results) {
                console.log(results);
              }
              if(results.features.length > 0) {
                console.log(results.features[0].geometry);
              }
             }

           }
         }
         res.write('console.log(\'AverageSpeed: \','+exports.averageSpeedFromPoints(points)+');\n');
         res.write('console.log(\'Distance Traveled: \','+exports.distanceTraveledFromPoints(points)+');\n');
         res.write('console.log(\'Average Height: \','+exports.averageHightDifferentFromPoints(points)+');\n');
         res.write('var pathCoords = '+JSON.stringify(latlng)+';\n\n');
         res.write('var checkpoint = '+JSON.stringify(checkpoint)+';\n');


         res.write('var pathLine = L.polyline(pathCoords).addTo(mymap);\n');
         res.write('var checkpoint = L.polyline(checkpoint).addTo(mymap);\n');
         res.write('mymap.fitBounds(pathLine.getBounds());');
         console.log("All done");
       }
       res.write("</script>")
       res.write("</body>");
       res.end();
     });
   }
   else {
     res.write("</script>")
     res.write("</body>");
     res.end();
   }
}

exports.checkCheckpoint = function(checkpointPos1, checkpointPos2, drivePos1, drivePos2) {
  //console.log(checkpointPos1, checkpointPos2, drivePos1, drivePos2);
  var pos1 = [checkpointPos1.lon, checkpointPos1.lat];
  var pos2 = [checkpointPos2.lon, checkpointPos2.lat];
  var pos3 = [drivePos1.lon, drivePos1.lat];
  var pos4 = [drivePos2.lon, drivePos2.lat];
  //console.log(pos1, pos2, pos3, pos4);
  return turf.lineIntersect(turf.lineString([pos1, pos2]), turf.lineString([pos3, pos4]));
}
