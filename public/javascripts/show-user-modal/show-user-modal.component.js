(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('app')
        .component('showUserModalComponent', {
            // template:'htmlTemplate',
            templateUrl: '/javascripts/show-user-modal/show-user-modal.component.html',
            controller: ShowUserModalComponentCtrl,
            controllerAs: '$ctrl',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
        });

    ShowUserModalComponentCtrl.$inject = [];
    function ShowUserModalComponentCtrl() {
        var $ctrl = this;
        
        ////////////////

        $ctrl.$onInit = function() { 
            // $ctrl.screen_name = $ctrl.resolve.screen_name;
            $ctrl.user = $ctrl.resolve.user.data;
            console.log($ctrl.user.profile_banner_url);
            $ctrl.user.profile_banner_url = $ctrl.user.profile_banner_url + '/600x200';
        };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();