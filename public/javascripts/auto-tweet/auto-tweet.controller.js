(function () {
    'use strict';

    angular
        .module('app')
        .controller('AutoTweetCtrl', AutoTweetCtrl);

    AutoTweetCtrl.$inject = ['$rootScope', '$window', '$auth', 'ScheduleTweet'];

    function AutoTweetCtrl($rootScope, $window, $auth, ScheduleTweet) {
        var vm = this;
        vm.newTweet = {
            text: '',
            datetime: null
        }
        vm.formInfo = null;
        vm.maxChars = 140;

        activate();

        vm.isAuthenticated = isAuthenticated;
        vm.cancel = cancel;
        vm.submit = submit;

        function activate() {
            if ($auth.isAuthenticated() && ($rootScope.currentUser)) {
                console.log('Auto tweeter view initialized..');
                ScheduleTweet
                    .tweets()
                    .success(function(response) {
                        console.log(response);
                        vm.tweets = response.data;
                    })
            }
        }

        function cancel() {
            vm.newTweet = {
                text: '',
                datetime: null
            }
        }

        vm.startDateBeforeRender = function ($dates) {
            const todaySinceMidnight = new Date();
            todaySinceMidnight.setUTCHours(0, 0, 0, 0);
            $dates.filter(function (date) {
                return date.utcDateValue < todaySinceMidnight.getTime();
            }).forEach(function (date) {
                date.selectable = false;
            });
        };

        function submit() {
            vm.formInfo = null;
            console.log('scheduling ...');
            ScheduleTweet
                .create(vm.newTweet)
                .success(function(response) {
                    console.log(response);
                    vm.formInfo = response.info;
                    vm.tweets.push(response.data);
                    cancel();
                })
                .error(function(error) {
                    console.log(error);
                })
        }

        function isAuthenticated() {
            return $auth.isAuthenticated();
        }
    }

})();