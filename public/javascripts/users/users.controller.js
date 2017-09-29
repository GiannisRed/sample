(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ['$rootScope', '$auth', 'UserAPI'];

    function UsersCtrl($rootScope, $auth, UserAPI){
        var vm = this;

        vm.users = null;

        vm.edit = edit;
        vm.update = update;
        vm.remove = remove;
        vm.refresh = refresh;

        activate();

        /////////////////

        function activate(){
            console.log($auth.isAuthenticated());
            if ($auth.isAuthenticated()) {
                console.log('Users View initialized...');
                getUsers();
            }
        }

        function refresh() {
            getUsers();
        }

        function remove(user, index) {
            UserAPI.remove(user._id)
                .success(function(response) {
                    vm.users.splice(index, 1);
                })
                .error(function(error) {
                    console.log(error);
                })
        }

        function edit(index) {
            vm.users[index].editable = true;
        }

        function update(user, index) {
            // TODO send AJAX to update
            UserAPI.update(user)
                .success(function(response) {
                    vm.users[index].editable = false;
                    console.log(response);
                })
                .error(function(error) {
                    console.log(error);
                });
        }

        function getUsers() {
            UserAPI.users()
            .success(function(response) {
                vm.users = response.data;
            })
            .error(function(error) {
                console.log(error);
            })
        }
    }
})();