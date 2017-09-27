(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('StreamCtrl', StreamCtrl);
    
    StreamCtrl.$inject = ['$rootScope', '$window', '$auth', 'TrackBy', 'mySocket', 'API', 'TweetIndicator'];
    
    function StreamCtrl($rootScope, $window, $auth, TrackBy, mySocket, API, TweetIndicator) {
        var vm = this;
        
        vm.tweets = [];
        vm.keyword = "";
        vm.isStreamActive = true;
        vm.newTweets = TweetIndicator.get();

        vm.isAuthenticated = isAuthenticated;
        vm.deleteTrack = deleteTrack;
        vm.createTrack = createTrack;
        vm.clear = clear;
        vm.toggleActive = toggleActive;
        vm.getNewTweets = getNewTweets;
        vm.currentPage = 0;
        vm.pageSize = 10;
        vm.total;
        vm.goToPage = goToPage;

        mySocket.on('tweet', function(tweet) {
            console.log(tweet);
            TweetIndicator.increment();
            console.log(vm.newTweets);
        });
        
        activate();

        function activate() {
            if ($auth.isAuthenticated() && ($rootScope.currentUser)) {
                console.log('Auto tweeter view initialized..');
                TrackBy.tracks()
                .success(function(response) {
                    console.log(response);
                    vm.tracks = response.data;
                    TrackBy
                        .status()
                        .success(function(response) {
                            vm.isStreamActive = response.status;

                            API.getStoredTweets()
                                .success(function(response) {
                                    console.log(response);
                                    vm.tweets = response.data;
                                    vm.total = response.total;
                                    TweetIndicator.reset();
                                })
                                .error(function(error) {
                                    console.log(error);
                                })
                        })
                        .error(function(error) {
                            console.log(error);
                        })
                })
                .error(function(error) {
                    console.log(error);
                });
            }
        }

        function goToPage(message, page, skip) {
            API
                .getStoredTweetsPaged(page-1, skip)
                .success(function(response) {
                    vm.tweets = response.data;
                    // vm.total = response.total;
                })
                .error(function(error) {
                    console.log(error);
                })
        }

        function getNewTweets() {
            API.getStoredTweets()
            .success(function(response) {
                console.log(response);
                vm.tweets = response.data;
                vm.total = response.total;
                TweetIndicator.reset();
            })
            .error(function(error) {
                console.log(error);
            });
        }
        
        function toggleActive() {
            TrackBy
                .toggle(!vm.isStreamActive)
                .success(function(response) {
                    console.log(response);
                    vm.isStreamActive = !vm.isStreamActive;
                })
                .error(function(error) {
                    console.log(error);
                })
        }

        function isAuthenticated() {
            return $auth.isAuthenticated();
        }

        function deleteTrack(id, index) {
            console.log('i will delete track..', id);
            TrackBy
                .destroy(id)
                .success(function(response) {
                    console.log(response);
                    vm.tracks.splice(index, 1);
                })
                .error(function(error) {
                    console.log(error);
                });
        }

        function createTrack() {
            vm.keywordError = null;
            console.log('I will create track..');
            TrackBy
                .create(vm.keyword)
                .success(function(response) {
                    console.log(response);
                    vm.tracks.push(response.data);
                    clear();
                })
                .error(function(error) {
                    console.log(error);
                    vm.keywordError = error.info;
                });
        }

        function clear() {
            vm.keyword = "";
        }
    }
    
})();