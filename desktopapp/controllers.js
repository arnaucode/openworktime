
angular.module('workApp', [])
  .controller('workController', function(
        $scope
    ) {
        $scope.username="user";
        //localStorage.clear();
    $scope.projects=[];
    if(localStorage.getItem("w_l_projects"))
    {
        $scope.projects=JSON.parse(localStorage.getItem("w_l_projects")); //w_local_
    }

    $scope.newproject={};
    $scope.newproject.id=$scope.projects[$scope.projects.length-1].id+1;
    $scope.addNewProject = function(){
        $scope.newproject.totaltime="0";
        $scope.projects.push($scope.newproject);
        localStorage.setItem("w_l_projects", angular.toJson($scope.projects));
        $scope.newproject={};
        $scope.newproject.id=$scope.projects.length+1;
    };
    $scope.removeProject = function(index){
        $scope.projects.splice(index, 1);
        localStorage.setItem("w_l_projects", angular.toJson($scope.projects));
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
