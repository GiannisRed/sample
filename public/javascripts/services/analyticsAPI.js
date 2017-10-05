(function () {
    'use strict';

    angular
        .module('app')
        .factory('AnalyticsAPI', AnalyticsAPI);

    AnalyticsAPI.$inject = ['$http'];

    function AnalyticsAPI($http){
        var service = {
            overview: overview,
            tweet: tweet,
            clientOverview: clientOverview,
            clientPerHashtag: clientPerHashtag
        };

        return service;

        ////////////////
        function overview() {
            return $http.get('http://127.0.0.1:3000/api/analytics/overview');
        }

        function tweet(tweet, period) {
            console.log(tweet, period);
            return $http.post('http://127.0.0.1:3000/api/analytics/tweet', { tweet: tweet, period: period });
        }

        function clientOverview() {
            return $http.get('http://127.0.0.1:3000/api/analytics/client');
        }

        function clientPerHashtag(hashtag) {
            return $http.post('http://127.0.0.1:3000/api/analytics/client', { hashtag: hashtag });
        }
    }
})();