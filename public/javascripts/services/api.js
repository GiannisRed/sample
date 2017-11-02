(function () {
    'use strict';

    angular
        .module('app')
        .factory('API', API);

    API.$inject = ['$http'];

    function API($http){
        var service = {
            getFeed: getFeed,
            getMediaById: getMediaById,
            likeMedia: likeMedia,
            self: self,
            getFollowers: getFollowers,
            userTimeline: userTimeline,
            search: search,
            homeTimeline: homeTimeline,
            showUser: showUser,
            removeTweet: removeTweet,
            getStoredTweets: getStoredTweets,
            getStoredTweetsPaged: getStoredTweetsPaged,
            tweet: tweet,
            getProfile: getProfile
        };

        return service;

        ////////////////
        function tweet(tweet) {
            return $http.post('http://127.0.0.1:3000/api/tweet', { status: tweet.status });
        }

        function getProfile() {
            return $http.get('http://127.0.0.1:3000/api/profile')
        }

        function getStoredTweets() {
            return $http.get('http://127.0.0.1:3000/api/tweets');
        }

        function getStoredTweetsPaged(page, skip) {
            return $http.post('http://127.0.0.1:3000/api/tweets', { page: page, skip: skip });
        }

        function removeTweet(tweet_id) {
            return $http.post('http://127.0.0.1:3000/api/statuses/destroy', { tweet_id: tweet_id });
        }

        function showUser(screen_name, user_id) {
            return $http.post('http://127.0.0.1:3000/api/users/show', { screen_name: screen_name, user_id: user_id });
        }

        function getFeed() {
            return $http.get('http://127.0.0.1:3000/api/feed');
        }

        function homeTimeline() {
            return $http.get('http://127.0.0.1:3000/api/home_timeline');
        }

        function getMediaById(id){
            return $http.get('http://127.0.0.1:3000/api/media/' + id);
        }

        function likeMedia(id){
            return $http.post('http://127.0.0.1:3000/api/like', { mediaId: id });
        }

        function self(){
            return $http.get('http://127.0.0.1:3000/api/self');
        }

        function getFollowers(){
            return $http.get('http://127.0.0.1:3000/api/followed-by');
        }

        function userTimeline(userId){
            return $http.get('http://127.0.0.1:3000/api/user_timeline', { user: userId });
        }

        function search(filters) {
            for(var key in filters) {
                if(filters.hasOwnProperty(key)) {
                    console.log(key, filters[key]);
                }
            }
            return $http.post('http://127.0.0.1:3000/api/search', { q: filters.q, result_type: filters.result_type, count: filters.count, include_entities: filters.include_entities, max_id: filters.max_id, since_id: filters.since_id });
        }
    }
})();