(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['API', '$window', '$auth', '$rootScope', '$uibModal'];
    
    function SearchCtrl(API, $window, $auth, $rootScope, $uibModal){
        var vm = this;

        vm.animationsEnabled = true;

        vm.filters = {
            q: '',
            result_type: 'mixed',
            count: 15,
            // current_page: 1
        }

        activate();

        vm.search = search;
        vm.previous = previous;
        vm.next = next;
        vm.showUser = showUser;

        function activate(){
            console.log(vm.filters);
            if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser.username)) {
                
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

        function search() {
            // vm.statuses = [];
            // vm.paginated_statuses = [];
            // vm.filters.current_page = 1;
            API.search(vm.filters).success(function(data) {
                console.log(data);
                vm.statuses = data.statuses;
                vm.paginated_statuses = vm.statuses;
                vm.search_metadata = data.search_metadata;
            });
        }

        function previous() {
            // --vm.filters.current_page;
            // var arr = angular.copy(vm.statuses);
            // vm.paginated_statuses = paginate(arr, vm.filters.count, vm.filters.current_page);
        }

        function paginate(array, page_size, page_number) {
            // console.log(page_number * page_size, (page_number + 1) * page_size);
            return array.splice(page_number * page_size, (page_number + 1) * page_size);
        }

        function next() {
            var nextResults = vm.search_metadata.next_results;
            if(!nextResults) {
                return;
            }

            var filters = splitToParams(nextResults);
            // console.log(filters);
            
            API.search(filters)
                .success(function(data) {
                    // vm.statuses = vm.statuses.concat(data.statuses);
                    // console.log(vm.statuses);
                    // var arr = angular.copy(vm.statuses);
                    // console.log(arr);
                    // vm.paginated_statuses = paginate(arr, vm.filters.count, vm.filters.current_page);
                    // console.log(vm.paginated_statuses);
                    vm.statuses = data.statuses;
                    vm.search_metadata = data.search_metadata;
                    // vm.filters.current_page += 1;
            });
        }

        function getMaxIdStr(array) {
            var max = array[0].id_str;
            return max;
        }

        function splitToParams(searchString) {
            var tmp = searchString.split('&');
            var params = {
                max_id: '',
                count: '',
                include_entities: '',
                result_type: '',
                q: vm.filters.q,
                since_id: ''
            };
            
            tmp.forEach(function(element) {
                for(var p in params) {
                    if(element.indexOf(p) != -1) {
                        if(p == 'q') {
                            continue;
                        }                        
                        var result = element.split('=')[1];
                        params[p] = result;
                    }
                }
            });
            return params;
        }

        function splitUrl(keyword, searchString) {
            var existsInString = searchString.indexOf(keyword);
            var result = null;
            var regex = null;
            switch(keyword) {
                case "max_id":
                    regex = /max_id=\w+/g
                    break;
                case "q":
                    regex = /q=\w+/g
                    break;
                case "count":
                    regex = /count=\w+/g
                    break;
                case "include_entities":
                    regex = /include_entities=\w+/g
                    break;
                case "result_type":
                    regex = /result_type=\w+/g
                    break;           
            }
            
            if(existsInString > 0) {
                var found = searchString.match(regex);
                console.log(found);
                var result = found[0].split('=')[1];
            }

            return result;
        }

    }
})();