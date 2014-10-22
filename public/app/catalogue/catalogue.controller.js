'use strict';

angular.module('archuploadApp')
  .controller('CatalogueCtrl', function ($scope, $http, socket, $stateParams, ProjectServices, $location) {
    $scope.studio = [];
	console.log($stateParams);
	ProjectServices.getStudio($stateParams.id).then(function(data){
		$scope.studio = data.plain();
	})

	ProjectServices.getProjectsByStudio($stateParams.id).then(function(data){
		$scope.projects = data.plain();
	})
    
  });
