(function () {
    'use strict';

    angular
        .module('app')
        .factory('AnalyticsAPI', AnalyticsAPI);

    AnalyticsAPI.$inject = ['$http'];

    function AnalyticsAPI($http){
        var service = {
            overview: overview
        };

        return service;

        ////////////////
        function overview() {
            return $http.get('http://127.0.0.1:3000/api/analytics/overview');
        }
    }
})();