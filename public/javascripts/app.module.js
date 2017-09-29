(function () {
  'use strict';

  angular
    .module('app', [
      'app.core',
      'satellizer'
    ])

    // Register the BearerAuthInterceptor.
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('BearerAuthInterceptor');
    })

    .config(function ($stateProvider, $urlRouterProvider, $authProvider) {

      $authProvider.loginUrl = 'http://localhost:3000/auth/login';
      $authProvider.signupUrl = 'http://localhost:3000/auth/signup';
      $authProvider.oauth2({
        name: 'instagram',
        url: 'http://127.0.0.1:3000/auth/instagram',
        redirectUri: 'http://127.0.0.1:3000',
        clientId: '919b2dd70ca342cdaefee72c32b8f772',
        requiredUrlParams: ['scope'],
        scope: ['likes'],
        scopeDelimiter: '+',
        authorizationEndpoint: 'https://api.instagram.com/oauth/authorize'
      });

      // Twitter
      $authProvider.twitter({
        url: '/auth/twitter',
        authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
        redirectUri: window.location.origin,
        oauthType: '1.0',
        popupOptions: {
          width: 495,
          height: 645
        }
      });
      //
      // For any unmatched url, redirect to /
      $urlRouterProvider.otherwise("/dashboard/home");
      //
      // Now set up the states
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: '/javascripts/dashboard/dashboard.html',
          redirectTo: 'dashboard.home'
        })
        .state('login', {
          url: "/login",
          templateUrl: "/javascripts/login/login.html",
          controller: 'LoginCtrl',
          controllerAs: 'vm'
        })
        .state('signup', {
          url: "/signup",
          templateUrl: "/javascripts/signup/signup.html",
          controller: 'SignupCtrl',
          controllerAs: 'vm'
        })
        .state('home', {
          parent: 'dashboard',
          url: "/home",
          templateUrl: "/javascripts/home/home.html",
          controller: 'HomeCtrl',
          controllerAs: 'vm'
        })
        .state('timeline', {
          parent: 'dashboard',
          url: "/timeline",
          templateUrl: "/javascripts/timeline/timeline.html",
          controller: 'TimelineCtrl',
          controllerAs: 'vm'
        })
        .state('search', {
          parent: 'dashboard',
          url: "/search",
          templateUrl: "/javascripts/search/search.html",
          controller: 'SearchCtrl',
          controllerAs: 'vm'
        })
        .state('stream', {
          parent: 'dashboard',
          url: "/stream",
          templateUrl: "/javascripts/stream/stream.html",
          controller: 'StreamCtrl',
          controllerAs: 'vm'
        })
        .state('autoTweet', {
          parent: 'dashboard',
          url: "/auto-tweet",
          templateUrl: "/javascripts/auto-tweet/auto-tweet.html",
          controller: 'AutoTweetCtrl',
          controllerAs: 'vm'
        })
        .state('task', {
          parent: 'dashboard',
          url: "/tasks",
          templateUrl: "/javascripts/task/task.html",
          controller: 'TaskCtrl',
          controllerAs: 'vm'
        })
        .state('followers', {
          parent: 'dashboard',
          url: "/followers",
          templateUrl: "/javascripts/followers/followers.html",
          controller: 'FollowersCtrl',
          controllerAs: 'vm'
        })
        .state('profile', {
          url: "/profile",
          templateUrl: "/javascripts/profile/profile.html",
          controller: 'ProfileCtrl',
          controllerAs: 'vm'
        })
        .state('detail', {
          url: '/photo/:id',
          templateUrl: '/javascripts/detail/detail.html',
          controller: 'DetailCtrl',
          controllerAs: 'vm'
        })
        .state('users', {
          parent: 'dashboard',
          url: "/users",
          templateUrl: "/javascripts/users/users.html",
          controller: 'UsersCtrl',
          controllerAs: 'vm',
          resolve: {
            isAuthenticated: function($q, $auth, $rootScope) {
              var deferred = $q.defer();

              if($rootScope.currentUser.role == 'admin') {
                deferred.resolve();
              } else {
                deferred.reject('You do not have the rights to view this page!')
              }
              return deferred.promise;
            }
          }
        });
    })
    .run(function ($rootScope, $window, $auth) {
      if ($auth.isAuthenticated()) {
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
      }
    });
})();