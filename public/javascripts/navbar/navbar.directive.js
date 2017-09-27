(function () {
    'use strict';

    angular
        .module('app')
        .directive('ccnavbar', ccnavbar);

    function ccnavbar(){
        var directive = {
            link: link,
            restrict: 'E',
            
        };

        return directive;
    }
})();