// Nook Harquail
//

var express = require("express");
var logfmt = require("logfmt");
var ydl = require("ydl");
var fs = require('fs')
var winston = require('winston');

var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
var http = require('http'); //the variable doesn't necessarily have to be named http
app.use(logfmt.requestLogger());

var tagsDictionary =[];

winston.add(winston.transports.File, {
  filename: 'tags.log'
});

countTags(process.argv[2]);

function countTags(fileName) {
	
	fs.readFile(fileName, 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  
	  var a = data;
	  a = a.split("\n");
	  
	  for (var i  in a){
	  	
		  var line = a[i];
		  var lineParsed= JSON.parse(line);
		  var tags = lineParsed["tags"];
		  
		  for(var i in tags){
			  
			  var tag = tags[i];
			  
		  	  subTags = tag.split(',');
			  
			  for(var k in subTags){
			  	
				 addTag(subTags[k]);
			  }
			  
			  function addTag(tag) {
				  // console.log(tag);
				  // tag = tag.replace(/\'/g,'');
			  	
				  if(tagsDictionary[tag] != null){
					  tagsDictionary[tag] += 1;
				  }
				  else{
					 tagsDictionary[tag] = 1;
				  }
				
			  };
			
		  }
		  
		
	  }
	  var dict = tagsDictionary;
	  
  	// Create items array
  	var items = Object.keys(dict).map(function(key) {
  	   return [key, dict[key]];
  	});

  	// Sort the array based on the second element
  	items.sort(function(first, second) {
  	   return second[1] - first[1];
  	});
 
 
 	console.log(items);
	});

};