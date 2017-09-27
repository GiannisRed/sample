(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);
    
    LoginCtrl.$inject = ['$rootScope', '$window', '$location', '$auth', '$state', '$scope'];
    
    function LoginCtrl($rootScope, $window, $location, $auth, $state, $scope){
        var vm = this;
        
        activate();
        
        function activate(){
            console.log(vm);
            console.log($rootScope);
        }
        
        vm.instagramLogin = function() {
          console.log('instagramLogin function...');
          $auth.authenticate('instagram')
            .then(function(response) {
              $window.localStorage.currentUser = JSON.stringify(response.data.user);
              $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
              console.log('success: ', response);
              $state.go('home');
            })
            .catch(function(response) {
              console.log('catch block', response.data);
            });
        };

        vm.twitterLogin = function() {
          $auth.authenticate('twitter')
            .then(function(response) {
              $window.localStorage.currentUser = JSON.stringify(response.data.user);
              $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
              console.log('success: ', response);
              $state.go('home');
            })
            .catch(function(response) {
              console.log('catch block', response.data);
            });
        }

        vm.emailLogin = function() {
          vm.errorMessage = {};
          $auth.login({ email: vm.email, password: vm.password })
            .then(function(response) {
              console.log('success: ', response);
              $window.localStorage.currentUser = JSON.stringify(response.data.user);
              $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
              $state.go('home');
            })
            .catch(function(response) {
              console.log('catch: ', response);
              vm.errorMessage = response.data.message;
              // vm.errorMessage = {};
              angular.forEach(response.data.message, function(message, field) {
                // $scope.loginForm[field].$setValidity('server', false);
                // vm.errorMessage[field] = response.data.message[field];
              });
            });
        };
    }
    
})();