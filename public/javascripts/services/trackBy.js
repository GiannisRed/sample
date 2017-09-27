(function () {
    'use strict';

    angular
        .module('app')
        .factory('TrackBy', TrackBy);

    TrackBy.$inject = ['$http'];

    function TrackBy($http){
        var service = {
            tracks: tracks,
            create: create,
            destroy: destroy,
            toggle: toggle,
            status: status
        };

        return service;

        ////////////////
        function tracks() {
            return $http.get('http://127.0.0.1:3000/api/trackBy');
        }

        function create(keyword) {
            return $http.post('http://127.0.0.1:3000/api/trackBy', {
                keyword: keyword
            });
        }

        function destroy(id) {
            return $http.delete('http://127.0.0.1:3000/api/trackBy/' + id)
        }

        function toggle(status) {
            return $http.post('http://127.0.0.1:3000/api/stream', { status: status });
        }

        function status() {
            return $http.get('http://127.0.0.1:3000/api/stream-status');
        }
    }
})();