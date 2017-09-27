(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['API', '$rootScope', '$auth'];

    function ProfileCtrl(API, $rootScope, $auth){
        var vm = this;

        activate();

        /////////////////

        function activate(){
            console.log($rootScope.currentUser);
            if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser.username)) {
                
            }
            API.showUser(null, $rootScope.currentUser.twitter).success(function(data) {
                console.log(data);
                vm.data = data;
            });
        }
    }
})();