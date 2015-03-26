// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive=require('../helpers/archive-helpers');



archive.readListOfUrls(function(array){
	for (var i=0; i<array.length; i++){
		(function(i){
			archive.isUrlArchived(array[i], function(archived){
				if (!archived){
					archive.downloadUrls([array[i]], function(){
						console.log("Finished downloading.. ");
					});
				}
			});
		})(i);
	}
});


// check if it's in the url list, and if it's in the archive
// if both matches, do nothing.
// if in the url list, but not in the archive, push to the array.

// after iterating all the url list, 
// call the download function with the array. 
