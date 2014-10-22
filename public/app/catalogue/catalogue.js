'use strict';

angular.module('archuploadApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('catalogue', {
        url: '/catalogue/:id',
        templateUrl: '/app/catalogue/catalogue.html',
        controller: 'CatalogueCtrl',
        controllerAs: 'Catalogue'
      });
  });