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
        console.log("Checking for url: ", url, " In the list: ", data, "...");
        if(data[i] === url){
          console.log("The url is in the list!");
        	callback(true);
        	return;
        }
  		}
    }
    console.log("The url is not on the list!");
  	callback(false);
  });
};

exports.addUrlToList = function(url, callback){
  //fs.write to list file
  console.log("adding ", url, " to our sites.txt...")
  url = url+"\n";
  callback = callback || function(){};
  fs.appendFile(exports.paths.list, url,function (err){
  	if (err){
  		callback(err);
  	}else{
      console.log("Successfully added ", url, " to our sites.txt!")
  		callback(null);
  	}
  });
};

exports.isUrlArchived = function(url, callback){
  //look for the downloaded html file in archivedSites path
  callback = callback || function(){};
  console.log("Checking if ", url, " has been archived...")
  fs.open(path.join(exports.paths.archivedSites, url), 'r', function(err){
  	if (err){
      console.log(url, " has not been archived!");
  		callback(false);
  	} else {
      console.log(url, " has already been archived!");
  		callback(true);
  	}
  })

};


exports.downloadUrls = function(array, callback){
	//send a get request to a url, and save the results
  console.log("downloading urls: ", array);
	callback = callback || function(){};
	for (var i=0; i<array.length; i++){
    (function(i){
  	  request.get('http://' + array[i], function(err, data){
  			if (err) {
  				callback(err);
  			}
  			else {
  		    fs.writeFile(path.join(exports.paths.archivedSites, array[i]), data.body,function(err){
  		    	if(err){
  		    		callback(err);
  		    	}else{
              console.log("completed saving the site: ", array[i]);
  				    callback(null, true);	
  		    	}
  		    });
  			}
  	  });
    })(i);
	}
};

