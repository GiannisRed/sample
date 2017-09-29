(function () {
    'use strict';

    angular
        .module('app')
        .controller('SidebarCtrl', SidebarCtrl);

    SidebarCtrl.$inject = ['$auth', 'TweetIndicator', '$rootScope'];

    function SidebarCtrl($auth, TweetIndicator, $rootScope){
        var vm = this;
        vm.isAdmin = isAdmin;

        activate();

        vm.isAuthenticated = isAuthenticated;
        vm.newTweets = TweetIndicator.get();

        function activate(){
            console.log(vm);
        }

        function isAuthenticated(){
            return $auth.isAuthenticated();
        }

        function isAdmin() {
            return $rootScope.currentUser.role == 'admin';
        }
    }
})();
