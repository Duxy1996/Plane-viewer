const WebSocket = require('ws');
var fs = require('fs');
const wss = new WebSocket.Server({ port: 8080 });

name_flghts = walk_files();

getflight();

function getflight(){
  var flight;
  wss.on('connection', function connection(ws) {
    var index = 0;
    ws.on('message', function incoming(message) {
      index = message;
      console.log('Received: %s', index);
      if(index >= name_flghts.length){
        ws.send("None");
      } else{
        fs.readFile('../flight/'+name_flghts[index], 'utf8', function(err, contents) {
          flight = contents;
          ws.send(flight);
        });
      }
    });
  });
}

function walk_files(){
  var files = fs.readdirSync('../flight/');
  return files;
}

