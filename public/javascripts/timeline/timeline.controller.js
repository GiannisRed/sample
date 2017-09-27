(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('TimelineCtrl', TimelineCtrl);
    
    TimelineCtrl.$inject = ['$rootScope', '$window', '$auth', 'API', '$uibModal'];
    
    function TimelineCtrl($rootScope, $window, $auth, API, $uibModal){
        var vm = this;
        
        activate();
        
        vm.isAuthenticated = isAuthenticated;
        vm.showUser = showUser;
        vm.removeTweet = removeTweet;
        vm.promptDelete = promptDelete;
        
        function activate(){
            if ($auth.isAuthenticated() && ($rootScope.currentUser )) {
                API.userTimeline($rootScope.currentUser.twitter).success(function(data) {
                    console.log(data);
                    vm.user_timeline_tweets = data;
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

        function promptDelete(tweet) {
            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                component: 'promptDeleteModalComponent',
                size: 'md',
                resolve: {
                  tweet: function () {
                    return tweet;
                  }
                }
              });
          
              modalInstance.result.then(function (tweet_id) {
                removeTweet(tweet_id);
              }, function () {
                // $log.info('modal-component dismissed at: ' + new Date());
              });
        }

        function removeTweet(id) {
            API.removeTweet(id)
                .success(function(response) {
                    var index = vm.user_timeline_tweets.findIndex(function(element) {
                        return element.id_str == id;
                    });
                    vm.user_timeline_tweets.splice(index, 1);
                })
                .error(function(error) {
                    console.log(error);
                })
        }
        
        function isAuthenticated(){
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