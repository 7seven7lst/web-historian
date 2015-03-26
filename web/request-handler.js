

var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var helpers=require('../web/http-helpers');
// require more modules/folders here!


  var getSite = function(request, response){

    var myUrl=request.url.slice(1);

    if( myUrl === "" ){
      helpers.serveAssets(response,  path.join(__dirname, "public/index.html"), 200);
      return;
    }

    if(myUrl.split(".").length < 3 || myUrl.split(".")[0] !== "www"){
      helpers.serveAssets(response, '404 - This page does not exist \n <a href="http://localhost:8080">Go Back</a>', 404);
      return;
    }

    console.log("GET: ", myUrl);
  	archive.isUrlInList(myUrl, function(listed){
  		if(listed){
        archive.isUrlArchived(myUrl, function(archived){
          if(archived){

            console.log("Now serving our archived version of ", myUrl);
            helpers.serveAssets(response,  path.join(__dirname, "../archives/sites/" + myUrl), 200);
            return;
          }else{

            console.log("Now serving our loading page...");
            helpers.serveAssets(response,  path.join(__dirname, "public/loading.html"), 404);
            return;
          }
        });
  		}else{
        setSite(response, myUrl);
        console.log("Now serving our loading page...");
        helpers.serveAssets(response,  path.join(__dirname, "public/loading.html"), 302);
        return;
  		}
  	});
  }

  var setSite = function(response, message){
    archive.isUrlArchived(message, function(archived){
      if(!archived){
        archive.addUrlToList(message, function(){
          archive.downloadUrls([message]);
        });
        return;
      }
    });
  }

//what runs whenever a request comes in
exports.handleRequest = function (request, response) {

	if(request.method === 'POST'){
    helpers.collectData(request, response, function(response, url){
      request.url = "/" + url;
      getSite(request, response);
    });
	}else{
		getSite(request, response);
  }

};
