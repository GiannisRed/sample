(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('app')
        .component('promptDeleteModalComponent', {
            // template:'htmlTemplate',
            templateUrl: '/javascripts/prompt-delete/prompt-delete.component.html',
            controller: PromptDeleteModalComponent,
            controllerAs: '$ctrl',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
        });

    PromptDeleteModalComponent.$inject = [];
    function PromptDeleteModalComponent() {
        var $ctrl = this;
        
        ////////////////

        $ctrl.$onInit = function() { 
            // $ctrl.screen_name = $ctrl.resolve.screen_name;
            $ctrl.tweet = $ctrl.resolve.tweet;
            console.log($ctrl.tweet);
        };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };

        $ctrl.ok = function () {
            $ctrl.close({$value: $ctrl.tweet.id_str});
        };
      
        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };
    }
})();