var fs = require('fs');

function walkFiles() {
  var nameFiles = fs.readdirSync('../flight/');  
  return nameFiles;
}

function readFiles(names){
  var index;  
  var contentFile = [];
  for (index = 0; index < names.length; index++) {    
    var contents = fs.readFileSync('../flight/'+names[index], 'utf8'); 
    contentFile.push(contents);
  }  
  return contentFile;
}

function getInfo(fileContent) {  
  var fileContent, index, placemark;  

  fileContent = clean_comments(fileContent);  
  fileContent = fileContent.split("<Placemark>");  
  placemark = fileContent[40].split(">");    
  
  var json = {};
  var tags = [];
  for (index = 0; index < placemark.length; index++) {
    placemark[index] = placemark[index].trim();
    if (placemark[index].indexOf(tags[tags.length-1]) !== -1) { 
      var auxTag, namename;          
      var json_2 = {};    
      auxTag = cleanTags(tags[tags.length-1]);      
      if (placemark[index].split("<")[0] != "") {      
        var indexBack;
        json_2[auxTag] = placemark[index].split("<")[0];
        for (indexBack = tags.length - 1;indexBack > 0;indexBack--) {  
            var tagName; 
            var json_3 = {};     
            tagName = cleanTags(tags[indexBack-1]);
            json_3[tagName] = copyJson(json_2); 
            json_2 = copyJson(json_3);                  
        } 
        firsttagName = cleanTags(tags[0]);         
        json[firsttagName] = json_2[firsttagName];
      }      
      tags.pop();  
    } else if (placemark[index].charAt(0) == "<") {      
        tags.push(placemark[index]);
    }    
  }
  return json;    
}

function cleanTags(tag) {
  return tag.replace(/</g,"").replace(/>/g,"");
}

function copyJson(json){
  return JSON.parse(JSON.stringify(json));
}

function clean_comments(text) {
  text = text.replace(/<\/Placemark>/g,"");
  text = text.replace(/\//g,"");
  text = text.replace(/<div>/g,"");
  text = text.replace(/<span>/g,"");
  text = text.replace(/<b>/g,"");
  text = text.replace(/<br>/g,"");
  text = text.replace(/<!\[CDATA\[/g,"");
  text = text.replace(/\]\]>/g,"");
  text = text.replace(/\r/g,"");
  text = text.replace(/\n/g,"");
  return text;
}

console.log(getInfo(readFiles(walkFiles())[0]));