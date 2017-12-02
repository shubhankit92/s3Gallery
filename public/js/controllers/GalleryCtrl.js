angular.module('GalleryCtrl', [])
	.controller('GalleryController', ['$scope', '$http', 'DBValues' ,function($scope, $http, DBValues) {
		DBValues.get()
			.then(function (data){
				$scope.url = "https://s3.amazonaws.com/shubh-bucket/";
				$scope.dataset = data.data;
			   },function (error){

			 });

		$scope.myRating = function(etag){
			var obj = {
				etag: etag,
				ratingValue: this.text
			}
			console.log(etag);
			DBValues.post(obj)
				.then(function (data){
			   },function (error){

			 });
		}

}]);
