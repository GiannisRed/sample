(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('HomeCtrl', HomeCtrl);
    
    HomeCtrl.$inject = ['$rootScope', '$window', '$auth', 'API', '$uibModal'];
    
    function HomeCtrl($rootScope, $window, $auth, API, $uibModal){
        var vm = this;
        
        activate();
        
        vm.isAuthenticated = isAuthenticated;
        vm.linkInstagram = linkInstagram;
        vm.linkTwitter = linkTwitter;
        vm.showUser = showUser;
        
        function activate(){
            console.log(vm);
            console.log($rootScope);
            // && $rootScope.currentUser.twitter
            if ($auth.isAuthenticated() && ($rootScope.currentUser )) {
                // API.userTimeline($rootScope.currentUser.twitter).success(function(data) {
                //     console.log(data);
                //     vm.user_timeline_tweets = data;
                // });
                API.homeTimeline().success(function(data) {
                    console.log(data);
                    vm.home_timeline_tweets = data;
                });
            }
        }

        function showUser(screen_name) {
            console.log('I will show user: ', screen_name);
            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                component: 'showUserModalComponent',
                size: 'lg',
                resolve: {
                  user: function (API) {
                    return API.showUser(screen_name, null);
                  }
                }
              });
          
              modalInstance.result.then(function (selectedItem) {
                // $ctrl.selected = selectedItem;
              }, function () {
                // $log.info('modal-component dismissed at: ' + new Date());
              });
        }
        
        function isAuthenticated(){
            // console.log($auth.isAuthenticated());
            return $auth.isAuthenticated();
        }
        
        function linkInstagram(){
            $auth.link('instagram')
                .then(function(response) {
                    console.log('link function:', response);
                    $window.localStorage.currentUser = JSON.stringify(response.data.user);
                    $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                    API.getFeed().success(function(data) {
                        vm.photos = data;
                    });
                });
        }

        function linkTwitter(){
            $auth.link('twitter')
                .then(function(response) {
                    console.log('link function:', response);
                    $window.localStorage.currentUser = JSON.stringify(response.data.user);
                    $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                    API.getFeed().success(function(data) {
                        vm.photos = data;
                    });
                });
        }
    }
    
})();