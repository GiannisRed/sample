(function () {
    'use strict';

    angular
        .module('app')
        .factory('TaskAPI', TaskAPI);

    TaskAPI.$inject = ['$http'];

    function TaskAPI($http){
        var service = {
            task: task,
            create: create,
            destroy: destroy,
            update: update
        };

        return service;

        ////////////////
        function task() {
            return $http.get('http://127.0.0.1:3000/api/task');
        }

        function create(subject) {
            return $http.post('http://127.0.0.1:3000/api/task', {
                subject: subject
            });
        }

        function destroy(id) {
            return $http.delete('http://127.0.0.1:3000/api/task/' + id)
        }

        function update(task) {
            return $http.put('http://127.0.0.1:3000/api/task/' + task._id, {
                subject: task.subject,
                completed: task.completed
            });
        }
    }
})();