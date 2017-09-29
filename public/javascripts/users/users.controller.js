(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ['$rootScope', '$auth'];

    function UsersCtrl($rootScope, $auth){
        var vm = this;

        activate();

        /////////////////

        function activate(){
            console.log($auth.isAuthenticated());
            if ($auth.isAuthenticated()) {
                console.log('Users View initialized...');
            }
        }
    }
})();