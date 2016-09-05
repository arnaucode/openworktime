
angular.module('workApp', [])
  .controller('workController', function(
        $scope,
        $interval
    ) {
        $scope.username="user";
        //localStorage.clear();
        $scope.working=false;
    $scope.projects=[];
    $scope.currentproject={};
    if(localStorage.getItem("w_l_projects"))
    {
        $scope.projects=JSON.parse(localStorage.getItem("w_l_projects")); //w_local_
    }
    if($scope.projects.length>0)
    {
        $scope.newproject={
            id: $scope.projects[$scope.projects.length-1].id+1
        };
    }else{
        $scope.newproject={
            id: 0
        };
    }
    //$scope.newproject.id=$scope.projects[$scope.projects.length-1].id+1;
    $scope.addNewProject = function(){
        $scope.newproject.totaltime="0";
        $scope.projects.push($scope.newproject);
        localStorage.setItem("w_l_projects", angular.toJson($scope.projects));
        $scope.newproject={
            id: $scope.projects[$scope.projects.length-1].id+1
        };
    };
    $scope.removeProject = function(index){
        $scope.projects.splice(index, 1);
        localStorage.setItem("w_l_projects", angular.toJson($scope.projects));
    };
    $scope.projectSelect = function(index){
        $scope.currentproject=$scope.projects[index];
    };
    var interval;
    $scope.currentStrike=0;
    $scope.btnWork = function(){
        $scope.working=true;
        $scope.currentStrike=0;
        interval = $interval(function(){
            $scope.currentStrike++;
            $scope.currentproject.totaltime++;
        }, 1000);
    };
    $scope.btnStop = function(){
        $interval.cancel(interval);
        $scope.working=false;
        localStorage.setItem("w_l_projects", angular.toJson($scope.projects));

    }

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

  })

  .filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(2016, 0, 1).setSeconds(seconds);
    };
}]);
