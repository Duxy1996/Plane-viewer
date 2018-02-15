var sceneEl = document.querySelector('a-scene');

var flight = "";

function up_down(event) {
  sceneEl = document.querySelector('a-scene');
  camera = sceneEl.querySelector('#cam');
  z = camera.components.position.attrValue.z;
  y = camera.components.position.attrValue.y;
  x = camera.components.position.attrValue.x;
  var let = event.which || event.keyCode;
  if (let == 101){
    camera.setAttribute('position', {x: x, y: (y+0.1), z: z});
  }
  if (let == 113){
    camera.setAttribute('position', {x: x, y: (y-0.1), z: z});
  }

}

function get_data(flight){
  flight = flight.replace(/\//g,"");
  flight = flight.replace(/<Point>/g,"");
  flight = flight.replace(/<Placemark>/g,"");
  flight = flight.replace(/<altitudeMode>absolute<altitudeMode>/g,"");
  flight = flight.replace(/<altitudeMode>clampToGround<altitudeMode>/g,"");
  flight = flight.replace(/<TimeStamp>/g,"");
  flight = flight.replace(/<Style>/g,"");
  flight = flight.replace(/<width>2<width>/g,"");
  flight = flight.replace(/<tessellate>1<tessellate>/g,"");
  flight = flight.replace(/<IconStyle>/g,"");
  flight = flight.replace(/<LineStyle>/g,"");
  flight = flight.replace(/<Folder>/g,"");
  flight = flight.replace(/<width>/g,"");
  flight = flight.replace(/<color>/g,"");
  flight = flight.replace(/<MultiGeometry>/g,"");
  flight = flight.replace(/<LineString>/g,"");
  flight = flight.replace(/<tessellate>/g,"");
  flight = flight.replace(/<MultiGeometry>/g,"");
  flight = flight.replace(/<Icon>/g,"");
  flight = flight.replace(/<div>/g,"");
  flight = flight.replace(/<span>/g,"");
  flight = flight.replace(/<b>/g,"");
  flight = flight.replace(/Altitude:/g,"");
  flight = flight.replace(/Speed:/g,"");
  flight = flight.replace(/ft/g,"");
  flight = flight.replace(/kt/g,"");
  flight = flight.replace(/&deg/g,"");
  flight = flight.replace(/Heading:/g,"");
  flight = flight.replace(/<when>/g,"");
  flight = flight.replace(/<heading>/g,"");
  flight = flight.replace(/<href>/g,"");
  flight = flight.replace(/Trail/g,"");
  flight = flight.replace(/<heading>87<heading>/g,"");
  flight = flight.replace(/ffffffff/g,"");
  flight = flight.replace(/<coordinates>/g,"");
  flight = flight.replace(/<name>/g,"");
  flight = flight.replace(/\r\n/g,"\n");
  flight = flight.split("![CDATA[");
  var i = 0;
  tramited_flight = [];
  for(i = 0; i < flight.length; i++){
    test = flight[i];
    test = test.replace(/ /g,"");
    test = test.replace(/<description></g,"");
    test = test.replace(/]]><description>/g,"");
    test = test.replace(/f*/g,"");
    test = test.split("\n");
    //test = test.split("\r");
    test = test.filter(function(a){return a !== ""});
    if(test.length == 8){
      tramited_flight.push(test);
    }
  }
  return tramited_flight;
}

function add_sphere(x,y,z){
  sceneEl = document.querySelector('a-scene');
  var sphere = document.createElement('a-sphere');
  sphere.setAttribute('geometry', {
    radius:0.01
  });
  sphere.setAttribute('position', {x: x, y: y, z: z});
  sphere.setAttribute('material', 'color', 'red');
  sphere.setAttribute('shadow','cast','true');
  sceneEl.appendChild(sphere);
}

var sent = 0;
getplanes();
function getplanes(kk){
  var exampleSocket;
  exampleSocket = new WebSocket("ws://localhost:8080","TPC");
  exampleSocket.onopen = function (event) {
    exampleSocket.send(sent);
    sent++;
  }
  exampleSocket.onmessage = function (event) {
    var flight_a = event.data;
    if(flight_a == "None"){
      alert("Se han cargado todos los vuelos disponibles");
    } else{
      flight = get_data(flight_a);
      for(i = 0; i < flight.length; i = i + 4){
        pos = flight[i][6].split(",");
        alt = flight[i][0].replace(/,/g,"");
        var latitud = pos[1];
        var longitud = pos[0];
        var xx = Math.cos(latitud/180*Math.PI) * Math.cos(longitud/180*Math.PI);
        var yy = Math.sin(latitud/180*Math.PI);
        var zz = Math.cos(latitud/180*Math.PI) * Math.sin(longitud/180*Math.PI);
        add_sphere(xx*10,zz*10,yy*10);
      }
      getplanes();
    }
  }
}




/*
setTimeout(
function sphere_set(){
  for(i = 0; i < 360; i = i + 10){
    for(j = -90; j <= 90; j = j + 10){
      var xx = Math.cos(j/180*Math.PI) * Math.cos(i/180*Math.PI);
      var yy = Math.sin(j/180*Math.PI);
      var zz = Math.cos(j/180*Math.PI) * Math.sin(i/180*Math.PI);
      add_sphere_blue(xx*10,yy*10,zz*10);
    }
  }
}
,800)
*/
