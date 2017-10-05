(function() {
    'use strict';

    angular
        .module('app')
        .controller('AnalyticsOverviewCtrl', AnalyticsOverviewCtrl);

    AnalyticsOverviewCtrl.$inject = ['AnalyticsAPI', '$auth', '$filter'];
    function AnalyticsOverviewCtrl(AnalyticsAPI, $auth, $filter) {
        var vm = this;

        vm.pageSize = 10;
        vm.currentPage = 1;
        vm.period = '24h';

        vm.tweetGraph = tweetGraph;
        vm.sortBy = sortBy;
        
        activate();

        ////////////////

        function activate() { 
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);
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

        function drawChart(data) {
            var data = google.visualization.arrayToDataTable(data);
    
            var options = {
              title: 'Tweets',
              curveType: 'function',
              legend: { position: 'bottom' }
            };
    
            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    
            chart.draw(data, options);
        }

        function sortBy(propertyName) {
            vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.propertyName = propertyName;
        };

        function tweetGraph() {
            vm.dataGraph = [];
            if(vm.hashtag) {
                AnalyticsAPI
                    .tweet(vm.hashtag, vm.period)
                    .success(function(response) {
                        console.log(response.data);
                        // vm.dataGraph = response.data;
                        var t = new Array();
                        t.push('Date');
                        t.push('Tweets');
                        vm.dataGraph.push(t);
                        angular.forEach(response.data, function(item){
                            if(vm.period == 'daily') {
                                var key = item._id.year.toString()+ '-' + item._id.month.toString() + '-' + item._id.dayOfMonth.toString();    
                            } else if(vm.period == 'monthly') {
                                var key = item._id.year.toString()+ '-' + item._id.month.toString();    
                            } else if(vm.period == 'yearly') {
                                var key = item._id.year.toString();
                            } else {
                                var key = item._id.year.toString()+ '-' + item._id.month.toString() + '-' + item._id.dayOfMonth.toString() + ' ' + item._id.hour.toString() + ':00';
                            }
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
                    })
            }
        }
    }
})();