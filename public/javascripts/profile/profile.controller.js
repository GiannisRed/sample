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
            API.getProfile().success(function(data) {            
                var screen_name = data.screen_name;

                API.showUser(screen_name, null).success(function(data) {
                    console.log(data);
                    vm.data = data;
                });
            });
        }
    }
})();