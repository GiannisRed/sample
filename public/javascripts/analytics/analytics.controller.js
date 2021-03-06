(function() {
    'use strict';

    angular
        .module('app')
        .controller('AnalyticsCtrl', AnalyticsCtrl);

    AnalyticsCtrl.$inject = ['AnalyticsAPI', '$auth'];
    function AnalyticsCtrl(AnalyticsAPI, $auth) {
        var vm = this;

        vm.pageSize = 10;
        vm.currentPage = 1;
        
        activate();

        ////////////////

        function activate() { 
            if ($auth.isAuthenticated()) {
                getOverview();
            }
        }

        function getOverview() {
            AnalyticsAPI
                .overview()
                .success(function(response) {
                    console.log(response);
                    vm.data = response.data;
                })
                .error(function(error) {
                    console.log(error);
                })
        }
    }
})();