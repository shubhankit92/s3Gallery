angular.module('GalleryFilter', [])
	.filter('filterEqualTo', function () {
	  return function (array, value) {
	  	if (value){
	  		var filtered = [];
	        // var letterMatch = new RegExp(letter, 'i');
	        if (array){
	        	for (var i = 0; i < array.length; i++) {
		            var item = array[i];
		            if (array[i].rating == value) {
		                filtered.push(item);
		            }
		        }
	        }
	        return filtered;
	  	}
	  	else
	  		return array;
	        
	  };
});
