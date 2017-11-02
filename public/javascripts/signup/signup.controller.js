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
            vm.success = null;
            vm.error = null;
            
            var user = {
                email: vm.email,
                password: vm.password
            };

            // Satellizer
            $auth.signup(user)
                .success(function(response) {
                    console.log(response);
                    vm.success = 'Your account has been created successfully!';
                })
                .catch(function(response){
                    console.log(response.data);
                    vm.error = response.data.message;
                });
        }
    }
    
})();