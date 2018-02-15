var fs = require('fs');

function walk_files(){
  var files = fs.readdirSync('../flight/');  
  return files;
}

function read_names(names){
  var index;  
  var content_file = [];
  for(index = 0; index < names.length; index++){    
    var contents = fs.readFileSync('../flight/'+names[index], 'utf8'); 
    content_file.push(contents);
  }  
  return content_file;
}

function get_info(file) {
  //clean comments
  file = file.replace(/<\/Placemark>/g,"");
  file = file.replace(/\//g,"");
  file = file.replace(/<div>/g,"");
  file = file.replace(/<span>/g,"");
  file = file.replace(/<b>/g,"");
  file = file.replace(/<br>/g,"");
  file = file.replace(/<!\[CDATA\[/g,"");
  file = file.replace(/\]\]>/g,"");
  file = file.replace(/\r/g,"");
  file = file.replace(/\n/g,"");
  file = file.split("<Placemark>");
  // iterate all the placemark
  placemark = file[500];
  placemark = placemark.replace(/>/g,">apart");
  placemark = placemark.split("apart");
  var index;
  for(index = 0; index < placemark.length; index++){
    placemark[index] = placemark[index].trim();    
  }
  var things = {};
  var tags = [];
  for(index = 0; index < placemark.length; index++){
    if(placemark[index].indexOf(tags[tags.length-1]) !== -1){         
      var aux_tag = tags[tags.length-1].replace(/</g,"").replace(/>/g,""); 
      var things_2 = {};
      if(placemark[index].split("<")[0] != ""){      
        things_2[aux_tag] = placemark[index].split("<")[0];             
        var index_back;
        for(index_back = tags.length - 1;index_back > 0;index_back--){        
            tagname = tags[index_back-1].replace(/</g,"").replace(/>/g,"");         
            var things_3 = {};               
            things_3[tagname] = JSON.parse(JSON.stringify(things_2)); 
            things_2 = JSON.parse(JSON.stringify(things_3));                  
        } 
        var namename = tags[0].replace(/</g,"").replace(/>/g,"")          
        things[namename] = things_2[namename];
      }
      
      tags.pop();  
    } else{
      if(placemark[index].charAt(0) == "<"){      
        tags.push(placemark[index]);
      }
    }
  }
  return things;    
}

console.log(get_info(read_names(walk_files())[0]));
//console.log(example);