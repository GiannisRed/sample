(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('app')
        .component('composeTweetComponent', {
            // template:'htmlTemplate',
            templateUrl: '/javascripts/compose-tweet/compose-tweet.html',
            controller: ComposeTweetComponentCtrl,
            controllerAs: '$ctrl',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
        });

    ComposeTweetComponentCtrl.$inject = ['API'];
    function ComposeTweetComponentCtrl(API) {
        var $ctrl = this;

        $ctrl.maxChars = 140;
        $ctrl.tweet = {
            status: ''
        }
        ////////////////

        $ctrl.$onInit = function() { 
        };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };

        $ctrl.ok = function () {
            $ctrl.error = null;
            API.tweet($ctrl.tweet)
                .success(function(response) {
                    console.log(response);
                    $ctrl.close({$value: 'ok'});
                })
                .error(function(error) {
                    console.log(error);
                    $ctrl.error = error.info;
                })
        };
      
        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };
    }
})();