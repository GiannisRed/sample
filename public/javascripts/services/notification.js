(function() {
    'use strict';

    angular
        .module('app')
        .service('TweetIndicator', TweetIndicator);

    TweetIndicator.$inject = [];
    function TweetIndicator() {

        var _indicator = {
            counter: 0
        };
        
        var service = {
            increment: increment,
            reset: reset,
            get: get
        }
        
        return service;
        ////////////////

        function increment() {
            return _indicator.counter += 1;
        }

        function reset() {
            return _indicator.counter = 0;
        }

        function get() {
            return _indicator;
        }
    }
})();