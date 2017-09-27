(function () {
    'use strict';

    angular
        .module('app')
        .controller('NavbarCtrl', NavbarCtrl);

    NavbarCtrl.$inject = ['$rootScope', '$window', '$auth', '$state', '$uibModal'];
    
    function NavbarCtrl($rootScope, $window, $auth, $state, $uibModal){
        var vm = this;
        vm.animationsEnabled = true;

        activate();

        vm.isAuthenticated = isAuthenticated;
        vm.logout = logout;
        vm.composeTweet = composeTweet;

        function activate(){
            console.log(vm);
        }

        function composeTweet() {
            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                component: 'composeTweetComponent',
                size: 'md',
                    resolve: {
                        
                    }
                });
            
                modalInstance.result.then(function () {
                        console.log('Tweet created');
                    }, function () {
                    // $log.info('modal-component dismissed at: ' + new Date());
                });
        }

        function isAuthenticated(){
            return $auth.isAuthenticated();
        }

        function logout(){
            $auth.logout();
            delete $window.localStorage.currentUser;
            $state.go('home');
        }
    }
})();