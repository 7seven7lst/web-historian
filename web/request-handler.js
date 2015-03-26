

var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var helpers=require('../web/http-helpers');
// require more modules/folders here!


  var getSite = function(request, response){
    console.log("request: ", request.url.slice(1));
    var myUrl=request.url.slice(1);
  	archive.isUrlInList(myUrl, function(data){
  		console.log(data);
  		if(data){
  		  //send our loading page
  		  helpers.serveAssets(response, path.join(__dirname,"public/loading.html"), 404);
  		  //add site
  		}else{
  			archive.isUrlArchived(myUrl, function(data){
  				console.log("DATA is ",data);
          if(data){
            //send our loading site
            helpers.serveAssets(response,  path.join(__dirname, "public/loading.html"), 404);
          }else{
            //send our archived page
            helpers.serveAssets(response,  path.join(__dirname, "../archives/sites/"+myUrl), 200);
          }
  			})
  		}
  	});
  }

  var setSite = function(request, response){
  	helpers.collectData(request, function(message){
  		console.log(message.url);
  		archive.addUrlToList(message.url, function(){
        response.writeHead(302, helpers.headers);
        response.end(message.url);
  		});
  	}); 	
  }

//what runs whenever a request comes in
exports.handleRequest = function (req, res) {

	if(req.method === 'POST'){

		setSite(req, res);
		return;

	}

	else if( url.parse(req.url).pathname === "/" ){
		helpers.serveAssets(res,  path.join(__dirname, "public/index.html"), 200);
		return;
	}

	else{
		getSite(req, res);
	}
	
};
