
angular.module('workApp', [])
  .controller('workController', function(
        $scope, $http
    ) {
    $scope.username="";

    if(localStorage.getItem('w_username')){
        $scope.username=localStorage.getItem('w_username');
    }

    $scope.onNew = function(){

    };

    $scope.openCode = function(){
        toastr.info("Visiting code");
        var urlCode="https://github.com/idoctnef/openworktime";
        if(typeof process !== 'undefined'){
            console.log(process.versions['electron']);
            const {shell} = require('electron');

            shell.openExternal(urlCode);
        }else{
            window.open(urlCode);
        }
    };

  });
