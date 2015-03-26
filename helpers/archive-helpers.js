var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  //fs.read the list file
  callback = callback || function(){};
  fs.readFile(exports.paths.list, 'utf8',function(err, data){
  	if (err) {
  		callback(err);
  	}
  	else {
  		data = data.split('\n');
  		callback(data);
  	}
  });
};

exports.isUrlInList = function(url, callback){
  //readlistofurls
  callback = callback || function(){};
  exports.readListOfUrls(function(data){
  	if (Array.isArray(data)){
  		for(var i = 0; i<data.length; i++){
        if(data[i] === url){
        	callback(true);
        	return;
        }
  		}
  		callback(false);
  	} else {
  		callback(false);
  	}
  });
};

exports.addUrlToList = function(url, callback){
  //fs.write to list file
  url = url+"\n";
  callback = callback || function(){};
  fs.appendFile(exports.paths.list, url,function (err){
  	if (err){
  		callback(err);
  	}else{
  		callback(null);
  	}
  });
};

exports.isUrlArchived = function(url, callback){
  //look for the downloaded html file in archivedSites path
  callback = callback || function(){};
  fs.open(path.join(exports.paths.archivedSites, url), 'r', function(err){
  	if (err){
  		callback(true);
  	} else {
  		callback(false);
  	}
  })

};


exports.downloadUrls = function(array, callback){
	//send a get request to a url, and save the results
	callback = callback || function(){};
	for (var i=0; i<array.length; i++){
	  request.get('http://' + array[i], function(err, data){
			if (err) {
				callback(err);
			}
			else {
		    fs.writeFile(path.join(exports.paths.archivedSites, data.request.uri.host), data.body,function(err){
		    	if(err){
		    		callback(err);
		    	}else{
				    callback(null, true);	
		    	}
		    });
			}
	  });
	}
};







/*
exports.downloadUrl = function(url, callback){
  //send a get request to a url, and save the results
  callback = callback || function(){};
  var urlName = url.replace(/\./g, '_') + '.html';
  request.get(url, function(err, data){
  	if (err) {
  		callback(err);
  	}
  	else {
      fs.writeFile(path.join(exports.paths.archivedSites, urlName), function(err){
      	if(err){
      		callback(err);
      	}else{
  		  callback(null, true);	
      	}
      });
  	}
  });
};

exports.downloadUrls = function(callback){
  // list = readFile(list).split("  ");
  callback = callback || function(){};
  fs.readFile(exports.paths.list, 'utf8', function(err, data){
  	if (err){
  		callback(err);
  	}
  	else {
  		var list = data.split("\n");

  		for (var i=0; i<list.length; i++){

  			exports.isUrlArchived(list[i], function(url){
  				if(url){
  					exports.downloadUrl(url);
  				}
  			});

  		}
  	}
  })
    // iterate through
    // isUrlArchived?
      // yes - do nothing
      // no - downloadUrl(url);
};
*/
