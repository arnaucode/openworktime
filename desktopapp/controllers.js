
angular.module('workApp', ['chart.js'])
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
            id: $scope.projects[$scope.projects.length-1].id+1,
            chart: {
                labels: [],
                series: ['Working time'],
                data: []
            }
        };
    }else{
        $scope.newproject={
            id: 0,
            chart: {
                labels: [],
                series: ['Working time'],
                data: []
            }
        };
    }
    //$scope.newproject.id=$scope.projects[$scope.projects.length-1].id+1;
    $scope.addNewProject = function(){
        $scope.newproject.totaltime="0";
        $scope.projects.push($scope.newproject);
        localStorage.setItem("w_l_projects", angular.toJson($scope.projects));
        $scope.newproject={
            id: $scope.projects[$scope.projects.length-1].id+1,
            chart: {
                labels: [],
                series: ['Working time'],
                data: []
            }
        };
    };
    $scope.editingIndex="";
    $scope.editProject = function(index){
        $scope.editingIndex=index;
        $scope.editingProject=angular.copy($scope.projects[index]);
    };
    $scope.cancelEditProject = function(){
        $scope.editingProject=false;
    };
    $scope.updateProject = function(){
        $scope.projects[$scope.editingIndex]=angular.copy($scope.editingProject);
        $scope.currentproject=angular.copy($scope.editingProject);
        $scope.editingProject=false;
    };
    $scope.removeProject = function(index){
        $scope.projects.splice(index, 1);
        localStorage.setItem("w_l_projects", angular.toJson($scope.projects));
        $scope.projectSelect(0);
    };
    $scope.projectSelect = function(index){
        $scope.btnStop();
        $scope.currentproject=$scope.projects[index];
    };
    var interval;
    $scope.currentStrike=0;
    $scope.btnWork = function(){
        $scope.editingProject=false;
        $scope.working=true;
        $scope.currentStrike=0;
        interval = $interval(function(){
            $scope.currentStrike++;
            $scope.currentproject.totaltime++;
        }, 1000);
    };
    $scope.btnStop = function(){
        $interval.cancel(interval);
        if($scope.working==true)
        {
            $scope.working=false;
            $scope.currentproject.chart.labels.push("work strike " + $scope.currentproject.chart.labels.length);
            $scope.currentproject.chart.data.push($scope.currentStrike);

            localStorage.setItem("w_l_projects", angular.toJson($scope.projects));
        }


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

    //chart
    /*$scope.chart={
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        series: ['Working time', 'Series B'],
        data: [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ]
    };*/

  })

  .filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(2016, 0, 1).setSeconds(seconds);
    };
}]);
