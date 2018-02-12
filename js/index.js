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
    camera.setAttribute('position', {x: x, y: (y+0.05), z: z});
  }
  if (let == 113){
    camera.setAttribute('position', {x: x, y: (y-0.05), z: z});
  }

}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                flight = allText;
                flight = get_data(flight)
            }
        }
    }
    rawFile.send(null);
}

//readTextFile("file:///C:/Users/Duxyb/Documents/GitHub/Plane_viewer/flight/6W703-106596d0.kml");

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
  flight = flight.replace(/\n/g,"");
  console.log(flight);
  flight = flight.split("![CDATA[");
  var i = 0;
  tramited_flight = [];
  for(i = 0; i < flight.length; i++){
    test = flight[i];
    test = test.replace(/ /g,"");
    test = test.replace(/<description></g,"");
    test = test.replace(/]]><description>/g,"");
    test = test.replace(/f*/g,"");
    test = test.split("\r");
    test = test.filter(function(a){return a !== ""});
    if(test.length == 8){
      tramited_flight.push(test);
      console.log(test);
    }
    
  }
  return tramited_flight;
}

function add_sphere(x,y,z){
  sceneEl = document.querySelector('a-scene');
  var sphere = document.createElement('a-sphere');
  sphere.setAttribute('geometry', {
    radius:1
  });
  sphere.setAttribute('position', {x: x, y: y, z: z});
  sphere.setAttribute('material', 'color', '#C6B566');
  sphere.setAttribute('shadow','cast','true');
  sceneEl.appendChild(sphere);
}

setTimeout(
  function(){    
    for(i = 0; i < flight.length; i++){
      pos = flight[i][6].split(",");
      alt = flight[i][0].replace(/,/g,"");
      add_sphere((pos[0]-37)*800 - 800,alt/200,(pos[1]-55)*800 -300);
    }

}
,1000)

var exampleSocket = new WebSocket("ws://localhost:8080","TPC");
exampleSocket.onopen = function (event) {
  exampleSocket.send("Here's some text that the server is urgently awaiting!"); 
};
exampleSocket.onmessage = function (event) {  
  var flight_a = event.data;
  //console.log(flight_a);
  flight = get_data(flight_a);
}
