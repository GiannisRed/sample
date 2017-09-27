(function () {
    'use strict';

    angular
        .module('app')
        .factory('ScheduleTweet', ScheduleTweet);

    ScheduleTweet.$inject = ['$http'];

    function ScheduleTweet($http){
        var service = {
            tweets: tweets,
            create: create,
            destroy: destroy,
            update: update
        };

        return service;

        ////////////////
        function tweets() {
            return $http.get('http://127.0.0.1:3000/api/scheduled-tweet');
        }

        function create(tweet) {
            return $http.post('http://127.0.0.1:3000/api/scheduled-tweet', {
                text: tweet.text,
                datetime: tweet.datetime
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