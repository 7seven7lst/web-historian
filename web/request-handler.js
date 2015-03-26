

var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var helpers=require('../web/http-helpers');
// require more modules/folders here!


  var getSite = function(request, response){
    var myUrl=request.url.slice(1);
    console.log("GET: ", myUrl);
  	archive.isUrlInList(myUrl, function(listed){
  		if(listed){
        archive.isUrlArchived(myUrl, function(archived){
          if(archived){
            //send our archived page
            console.log("Now serving our archived version of ", myUrl);
            helpers.serveAssets(response,  path.join(__dirname, "../archives/sites/" + myUrl), 200);
          }else{
            //send our loading page
            console.log("Now serving our loading page...");
            helpers.serveAssets(response,  path.join(__dirname, "public/loading.html"), 404);
          }
        });
  		}else{
        // Start saving the page here
        console.log("Now serving our 404 page...");
        helpers.serveAssets(response, path.join(__dirname,"public/loading.html"), 404);
  		}
  	});
  }

  var setSite = function(request, response){
  	helpers.collectData(request, function(message){
      console.log("POST:", message);
      archive.isUrlArchived(message, function(archived){
        if(archived){
          //send our archived page
          //console.log("Now serving our archived version of ", myUrl);
          helpers.serveAssets(response,  path.join(__dirname, "../archives/sites/" + message), 200);
        }else{
          archive.addUrlToList(message, function(){
            helpers.serveAssets(response,  path.join(__dirname, "public/loading.html"), 302);
            archive.downloadUrls([message]);
          });
        }
      })

  	}); 	
  }

//what runs whenever a request comes in
exports.handleRequest = function (req, res) {

	if(req.method === 'POST'){
		setSite(req, res);
		return;
	}else if( url.parse(req.url).pathname === "/" ){
		helpers.serveAssets(res,  path.join(__dirname, "public/index.html"), 200);
		return;
	}else{
    console.log("getting site...")
		getSite(req, res);
	}
	
};
