angular.module('GalleryService', [])
	.factory('DBValues', ['$http', function($http) {
		return {
			get : function() {
				var data = $http.get('/images');
				return data;
			},
			post : function(obj) {
				var data = $http.post('/etags', obj);
				return data;
			}
		}
}]);