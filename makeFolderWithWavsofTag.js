// Nook Harquail
//

var express = require("express");
var logfmt = require("logfmt");
var ydl = require("ydl");
var fs = require('fs.extra');
var winston = require('winston');

var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
var http = require('http'); //the variable doesn't necessarily have to be named http
app.use(logfmt.requestLogger());


winston.add(winston.transports.File, {
	filename: 'tags.log'
});


var directory = process.argv[2];

wantedIDs(process.argv[3]);
// console.log(wantedIds);


function copyFilesToWavDirectory(wantedIds) {
	var wavDir = directory + 'wav/';
	var newDir = directory + process.argv[3] + '/';
	var fileList = fs.readdirSync(wavDir);

	fs.mkdirSync(newDir, 0755);

	for (var i in fileList) {

		var file = fileList[i];

		
		if(wantedIds.indexOf(fileId(file)) > -1){
			
			var oldFile = wavDir + file;
			var newFile = newDir + file;

			// console.log("copied "+file+" to "+newFile);
		    fs.copy(oldFile,newFile,{ replace: false },
			
			    function (err) {
			     if (err) {
			       // i.e. file already exists or can't write to directory 
			       throw err;
			     }
				 
			     console.log("Copied"+oldFile);
			   });
		}
	}

	function fileId(file) {
		var flen = file.length;
		return file.substring(flen - 19, flen - 8);
	}

}

// fs.copy('foo.txt', 'bar.txt', { replace: false }, function (err) {
//   if (err) {
//     // i.e. file already exists or can't write to directory
//     throw err;
//   }
//
//   console.log("Copied 'foo.txt' to 'bar.txt');

//replace v%3D with v=


//return a list of only the urls we're interested in

function wantedIDs(wantedTag) {
	var urls = [];
	var fileName = directory + '/fileData.log';

	fs.readFile(fileName, 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}

		var a = data;
		a = a.split("\n");

		for (var i in a) {

			var line = a[i];
			var lineParsed = JSON.parse(line);
			var url = lineParsed["url"];
			var tags = lineParsed["tags"];

			// console.log(url);

			for (var i in tags) {

				var tag = tags[i];

				subTags = tag.split(',');

				for (var k in subTags) {

					// console.log(subTags[k]);
					if (subTags[k] == wantedTag) {

						//replace v=
						url = url.replace("v\%3D", "v=");
						urls.push(idFromURL(url));

						function idFromURL(url) {
							var index = url.indexOf("v=")
							if (index == -1) {
								return null;
							} else {
								return url.substring(index + 2, index + 13);
							}
						}
					}
				}
			}
		}
		copyFilesToWavDirectory(urls);
	});




};


function youtubeIdFromURL(URL) {




}
