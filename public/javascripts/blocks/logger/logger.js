(function() {
  'use strict';

  angular
    .module('blocks.logger')
    .factory('logger', logger);

  logger.$inject = ['$log', 'toastr'];

  /* @ngInject */
  function logger($log, toastr) {
    var service = {
      showToasts: true,

      error: error,
      info: info,
      success: success,
      warning: warning,

      // straight to console; bypass toastr
      log: $log.log
    };

    return service;
    /////////////////////

    function error(message, data, title) {
      toastr.error(message, title);
      $log.error('Error: ' + message, data);
    }

    function info(message) {
      toastr.info(message);
      $log.info('Info: ' + message);
    }

    function success(message, data, title) {
      toastr.success(message, title);
      $log.info('Success: ' + message, data);
    }

    function warning(message, data, title) {
      toastr.warning(message, title);
      $log.warn('Warning: ' + message, data);
    }
  }
}());