(function() {
    'use strict';
    
      angular
        .module('app')
        .factory('BearerAuthInterceptor', BearerAuthInterceptor);
    
      BearerAuthInterceptor.inject = ['$window', '$q'];
      function BearerAuthInterceptor($window, $q) {
          console.log('Interceptor!', $window.localStorage.token);
        return {
          request: function(config) {
                config.headers = config.headers || {};
                if ($window.localStorage.token) {
                  // may also use sessionStorage
                    config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
                }
                return config || $q.when(config);
            },
            response: function(response) {
                if (response.status === 401) {
                    //  Redirect user to login page / signup Page.
                    console.log('Not Authenticated User');
                }
                return response || $q.when(response);
            }
        };
      }
    })();
    