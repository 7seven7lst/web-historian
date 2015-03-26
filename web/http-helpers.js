var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, code) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
    fs.readFile(asset, function(error, file){

    	res.writeHead(code, exports.headers);
    	res.write(file);
    	res.end();

    });
};

exports.collectData=function(request, callback){
	var data="";
	request.on('data', function(chunk){
		data+=chunk;
	});
	request.on('end', function(){   
    data=data.substr(4);
		callback(data);
	});
};



// As you progress, keep thinking about what helper functions you can put here!
