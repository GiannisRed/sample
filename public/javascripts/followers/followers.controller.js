(function () {
    'use strict';

    angular
        .module('app')
        .controller('FollowersCtrl', FollowersCtrl);

    FollowersCtrl.$inject = ['API', '$window', '$auth', '$rootScope'];
    
    function FollowersCtrl(API, $window, $auth, $rootScope){
        var vm = this;

        activate();

        function activate(){
            if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser.username)) {
                API.getFollowers().success(function(data) {
                    console.log(data);
                    vm.data = data;
                });
            }
        }

    }
})();