const WebSocket = require('ws');
var fs = require('fs');

const wss = new WebSocket.Server({ port: 8080 });

getflight();

function getflight(){
  var flight;
  fs.readFile('../flight/5X219-106aa2cd.kml', 'utf8', function(err, contents) {
      flight = contents;
      wss.on('connection', function connection(ws) {
        ws.send(flight);
      });
  });

}
