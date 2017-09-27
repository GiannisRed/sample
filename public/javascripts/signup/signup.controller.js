(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('SignupCtrl', SignupCtrl);
    
    SignupCtrl.$inject = ['$rootScope', '$auth'];
    
    function SignupCtrl($rootScope, $auth){
        var vm = this;
        
        activate();

        vm.signup = signup;
        
        function activate(){
            console.log(vm);
            console.log($rootScope);
        }

        function signup(){
            var user = {
                email: vm.email,
                password: vm.password
            };

            // Satellizer
            $auth.signup(user)
                .catch(function(response){
                    console.log(response.data);
                });
        }
    }
    
})();