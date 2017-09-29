(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserAPI', UserAPI);

    UserAPI.$inject = ['$http'];

    function UserAPI($http){
        var service = {
            users: users,
            remove: remove,
            update: update
        };

        return service;

        ////////////////
        function users() {
            return $http.get('http://127.0.0.1:3000/api/users');
        }

        function remove(id) {
            return $http.delete('http://127.0.0.1:3000/api/user/' + id);
        }

        function update(user) {
            for(var k in user) {
                if(user[k] == '') {
                    user[k] = null;
                }
                console.log(k);
            }
            return $http.put('http://127.0.0.1:3000/api/user', { user: user });
        }
    }
})();