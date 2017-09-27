(function () {
    'use strict';

    angular
        .module('app')
        .controller('SidebarCtrl', SidebarCtrl);

    SidebarCtrl.$inject = ['$auth', 'TweetIndicator'];

    function SidebarCtrl($auth, TweetIndicator){
        var vm = this;

        activate();

        vm.isAuthenticated = isAuthenticated;
        vm.newTweets = TweetIndicator.get();

        function activate(){
            console.log(vm);
        }

        function isAuthenticated(){
            return $auth.isAuthenticated();
        }
    }
})();
