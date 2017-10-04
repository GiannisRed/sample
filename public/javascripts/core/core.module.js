(function() {
  'use strict';

  angular
    .module('app.core', [
      'ngAnimate',
      'ngSanitize',
      'ui.router',
      'ui.bootstrap',
      'ui.bootstrap.datetimepicker',
      'btford.socket-io',
      'bw.paging',
      'angularUtils.directives.dirPagination'
    ]);
})();