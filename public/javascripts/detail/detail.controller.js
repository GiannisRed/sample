(function () {
    'use strict';

    angular
        .module('app')
        .controller('DetailCtrl', DetailCtrl);

    DetailCtrl.$inject = ['$rootScope', '$location', 'API'];

    function DetailCtrl($rootScope, $location, API){
        var vm = this;

        activate();

        vm.like = like;

        function activate(){
            console.log('Detail ctrl activated...');
            var mediaId = $location.path().split('/').pop();
            console.log(mediaId);

            API.getMediaById(mediaId).success(function(media) {
                vm.hasLiked = media.user_has_liked;
                vm.photo = media;
            });
        }

        function like(){
            vm.hasLiked = true;
            API.likeMedia(mediaId).error(function(data) {
                // sweetAlert('Error', data.message, 'error');
                console.log('error at like() ', data);
            });
        }

    }
})();