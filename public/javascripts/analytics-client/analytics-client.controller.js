(function() {
    'use strict';

    angular
        .module('app')
        .controller('ClientCtrl', ClientCtrl);

    ClientCtrl.$inject = ['$auth', 'AnalyticsAPI'];
    function ClientCtrl($auth, AnalyticsAPI) {
        var vm = this;

        vm.pageSize = 10;
        vm.currentPage = 1;

        activate();

        vm.getClientUsagePerHashtag = getClientUsagePerHashtag;
        vm.sortBy = sortBy;

        ////////////////

        function activate() {
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart); 
            if ($auth.isAuthenticated()) {
                console.log('client usage...');
                getOverviewClientUsage();
            }
        }

        function getOverviewClientUsage() {
            AnalyticsAPI
                .clientOverview()
                .success(function(response) {
                    console.log(response);
                    vm.data = response.data;
                })
                .error(function(error) {
                    console.log(error);
                })
        }

        function getClientUsagePerHashtag() {
            vm.dataGraph = [];
            AnalyticsAPI
                .clientPerHashtag(vm.hashtag)
                .success(function(response) {
                    console.log(response);
                    var t = new Array();
                    t.push('Client');
                    t.push('Tweets');
                    vm.dataGraph.push(t);
                    angular.forEach(response.data, function(item){
                        var key = item._id;
                        var value = item.count;
                        var t = new Array();
                        t.push(key);
                        t.push(value);
                        vm.dataGraph.push(t);
                    });
                    drawChart(vm.dataGraph);
                })
                .error(function(error) {
                    console.log(error);
                });
        }

        function sortBy(propertyName) {
            vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.propertyName = propertyName;
        }

        function drawChart(data) {
            var data = google.visualization.arrayToDataTable(data);

            var options = {
                title: 'Client Usage'
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart'));

            chart.draw(data, options);
        }
    }
})();