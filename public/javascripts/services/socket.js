(function() {
    'use strict';

    angular
        .module('app')
        .factory('mySocket', mySocket);

    mySocket.$inject = ['socketFactory'];
    function mySocket(socketFactory) {
        var myIoSocket = io.connect('localhost:4000');

        mySocket = socketFactory({
            ioSocket: myIoSocket
        });

        return mySocket;
    }
})();